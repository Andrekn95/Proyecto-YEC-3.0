import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCatalogueDto, UpdateCatalogueDto } from '@modules/common/catalogue/dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CacheEnum, CommonRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PaginationDto } from '@utils/pagination';
import { ModelCatalogueEntity } from '@modules/common/catalogue/model-catalogue.entity';

@Injectable()
export class CataloguesService {
  clientRedis: any = null;

  constructor(
    @Inject(CommonRepositoryEnum.catalogueRepository)
    private repository: Repository<CatalogueEntity>,
    @Inject(CommonRepositoryEnum.modelCatalogueRepository)
    private modelCatalogueRepository: Repository<ModelCatalogueEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findCacheModelCatalogues(): Promise<ModelCatalogueEntity[]> {
    // Recuperar del cache
    const cached = await this.cacheManager.get<ModelCatalogueEntity[]>(CacheEnum.model_catalogues);

    if (cached?.length) {
      return cached;
    }

    // Si no hay cache, consultar la BD
    const catalogues = await this.modelCatalogueRepository
      .createQueryBuilder('mc')
      .leftJoin('mc.catalogue', 'catalogue')
      .select([
        'mc.id', // o los campos que necesites de la entidad principal
        'mc.modelId', // o los campos que necesites de la entidad principal
        'catalogue.id', // o los campos que necesites de la entidad principal
        'catalogue.name',
        'catalogue.code',
        'catalogue.type',
        'catalogue.enabled',
        'catalogue.parentId',
        'catalogue.acronym',
        'catalogue.required',
      ])
      .getMany();

    // Guardar en cache con TTL opcional
    await this.cacheManager.set(CacheEnum.catalogues, catalogues, 300);

    return catalogues;
  }

  async loadCacheModelCatalogues(): Promise<boolean> {
    const catalogues = await this.modelCatalogueRepository
      .createQueryBuilder('mc')
      .leftJoin('mc.catalogue', 'catalogue')
      .select([
        'mc.id', // o los campos que necesites de la entidad principal
        'mc.modelId', // o los campos que necesites de la entidad principal
        'catalogue.id', // o los campos que necesites de la entidad principal
        'catalogue.name',
        'catalogue.code',
        'catalogue.type',
        'catalogue.enabled',
        'catalogue.parentId',
        'catalogue.acronym',
        'catalogue.required',
      ])
      .getMany();

    await this.cacheManager.set<ModelCatalogueEntity[]>(
      CacheEnum.model_catalogues,
      catalogues,
      300,
    );

    return true;
  }

  async create(payload: CreateCatalogueDto): Promise<CatalogueEntity> {
    const entityExist = await this.repository.findOne({
      where: [{ code: payload.code, type: payload.type }],
    });

    if (entityExist) throw new BadRequestException('El registro ya existe');

    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    await this.repository.find();
    return {
      data: {},
      pagination: {},
    };
  }

  async findOne(id: string): Promise<CatalogueEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async update(id: string, payload: UpdateCatalogueDto): Promise<CatalogueEntity> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<CatalogueEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return await this.repository.softRemove(entity);
  }

  async findCache(): Promise<CatalogueEntity[]> {
    // Recuperar del cache
    const cached = await this.cacheManager.get<CatalogueEntity[]>(CacheEnum.catalogues);

    if (cached?.length) {
      return cached;
    }

    // Si no hay cache, consultar la BD
    const catalogues = await this.repository.find({
      select: ['id', 'code', 'name', 'type', 'enabled', 'parentId', 'acronym', 'required'],
      order: {
        type: 'asc',
        sort: 'asc',
        name: 'asc',
      },
    });

    // Guardar en cache con TTL opcional
    await this.cacheManager.set(CacheEnum.catalogues, catalogues, 300);

    return catalogues;
  }

  async loadCache(): Promise<boolean> {
    const catalogues = await this.repository.find({
      select: ['id', 'code', 'name', 'type', 'enabled', 'parentId', 'acronym', 'required'],
      order: { type: 'asc', sort: 'asc', name: 'asc' },
    });

    await this.cacheManager.set<CatalogueEntity[]>(CacheEnum.catalogues, catalogues, 300);

    return true;
  }
}
