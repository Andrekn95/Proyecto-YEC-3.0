import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Equal, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FileEntity } from './file.entity';
import { CommonRepositoryEnum } from '@utils/enums';
import * as path from 'path';
import { PaginationDto } from '@utils/pagination';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { CreateFileDto, CreateProcessFileDto, FilterFileDto } from './dto';
import { format } from 'date-fns';
import { FileDownloadLogEntity } from '@modules/common/file/file-download-log.entity';
import { UserEntity } from '@auth/entities';
import { Request, Response } from 'express';
import { BucketService } from '@modules/common/bucket/bucket.service';

@Injectable()
export class FileService {
  constructor(
    @Inject(CommonRepositoryEnum.fileRepository)
    private repository: Repository<FileEntity>,
    @Inject(CommonRepositoryEnum.fileDownloadLogRepository)
    private fileDownloadLogRepository: Repository<FileDownloadLogEntity>,
    private readonly bucketService: BucketService,
  ) {}

  async uploadFile({ file, user, modelId, typeId, folder, manager }: CreateFileDto) {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    const filePath = `${folder}/${format(new Date(), 'yyyy/MM')}/${fileName}`;

    const repository = manager ? manager.getRepository(FileEntity) : this.repository;

    const payload = {
      modelId,
      userId: user?.id,
      fileName,
      name: file.originalname,
      extension: path.extname(file.originalname),
      originalName: file.originalname,
      path: filePath,
      size: file.size,
      typeId: typeId,
      mimeType: file.mimetype,
    };

    const newFile = repository.create(payload);

    // await this.minioService.uploadFile({
    //   filePath,
    //   buffer: file.buffer,
    //   size: file.size,
    //   mimetype: file.mimetype,
    // });

    await this.bucketService.uploadFile({
      filePath,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    return await repository.save(newFile);
  }

  async uploadProcessFile({
    file,
    user,
    modelId,
    typeId,
    activity,
    manager,
    ruc,
  }: CreateProcessFileDto) {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    const filePath = `process/${ruc}/${activity}/${fileName}`;

    const repository = manager ? manager.getRepository(FileEntity) : this.repository;

    const payload = {
      modelId,
      userId: user?.id,
      fileName,
      name: file.originalname,
      extension: path.extname(file.originalname),
      originalName: file.originalname,
      path: filePath,
      size: file.size,
      typeId: typeId,
      mimeType: file.mimetype,
    };

    const newFile = repository.create(payload);

    // await this.minioService.uploadFile({
    //   filePath,
    //   buffer: file.buffer,
    //   size: file.size,
    //   mimetype: file.mimetype,
    // });

    await this.bucketService.uploadFile({
      filePath,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    return await repository.save(newFile);
  }

  async uploadFiles(
    files: Array<Express.Multer.File>,
    modelId: string,
    typeIds: string[],
    userId: string,
  ): Promise<FileEntity[]> {
    if (!files?.length) {
      throw new Error('No existen archivos para subir');
    }

    let i = 0;

    if (!Array.isArray(typeIds)) {
      typeIds = [typeIds];
    }

    const saveOperations = files.map((file) => {
      const relativePath = path.relative(process.cwd(), path.join(file.destination, file.filename));

      const payload = {
        modelId,
        userId,
        fileName: file.filename,
        extension: path.extname(file.originalname),
        originalName: file.originalname,
        path: relativePath,
        size: file.size,
        typeId: typeIds[i],
      };

      const newFile = this.repository.create(payload);

      i++;

      return this.repository.save(newFile);
    });

    return await Promise.all(saveOperations);
  }

  async findOne(id: number): Promise<FileEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('El perfil no existe');
    }

    return entity;
  }

  async findUrl(id: number, user: UserEntity, req: Request): Promise<string> {
    const file = await this.findOne(id);

    if (!file) {
      throw new NotFoundException();
    }

    // const url = await this.minioService.generatePresignedUrl(file.path);
    const url = await this.bucketService.generatePresignedUrl(file.path);

    const fileDownloadLog = this.fileDownloadLogRepository.create({
      file,
      user,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    await this.fileDownloadLogRepository.save(fileDownloadLog);

    return url;
  }

  async download(id: number, user: UserEntity, req: Request, res: Response) {
    const file = await this.findOne(id);

    if (!file) {
      throw new NotFoundException();
    }

    const stream: any = await this.bucketService.getObject(file.path);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Cache-Control': 'no-store',
    });

    const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const cleanIp = rawIp.includes('::ffff:') ? rawIp.split('::ffff:')[1] : rawIp;

    await this.fileDownloadLogRepository.save({
      file,
      user,
      ipAddress: cleanIp === '::1' ? '127.0.0.1' : cleanIp,
      userAgent: req.headers['user-agent'],
    });

    stream.pipe(res);
  }

  async findByModel(
    modelId: string,
    params?: FilterFileDto,
  ): Promise<ServiceResponseHttpInterface> {
    //Pagination & Filter by search
    if (params && params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(modelId, params);
    }

    //All
    const data = await this.repository.findAndCount({
      relations: { type: true },
      where: { modelId },
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  private async paginateAndFilter(
    modelId: string,
    params: FilterFileDto,
  ): Promise<ServiceResponseHttpInterface> {
    let where: FindOptionsWhere<FileEntity> | FindOptionsWhere<FileEntity>[];

    let { page, search } = params;
    const { limit } = params;

    where = [];
    where.push({ modelId: Equal(modelId) });

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({
        originalName: ILike(`%${search}%`),
        modelId: Equal(modelId),
      });
    }

    const response = await this.repository.findAndCount({
      relations: { type: true },
      where,// review aumentar take y skip para la paginacion
    });

    return {
      pagination: { limit, totalItems: response[1] },
      data: response[0],
    };
  }

  async remove(id: number): Promise<any> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException({
        error: 'Registro no encontrado',
        message: 'Registro no encontrado',
      });
    }

    return await this.repository.softRemove(entity);
  }
}
