import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { fileFilter, getFileName } from '@utils/helpers';
import { ResponseHttpInterface } from '@utils/interfaces';
import { join } from 'path';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterFileDto } from './dto';
import { User } from '@auth/decorators';
import { UserEntity } from '@auth/entities';
import { Request, Response } from 'express';

@ApiTags('Files')
@Controller('common/files')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @ApiOperation({ summary: 'Upload File' })
  @Post(':modelId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: fileFilter,
      limits: { fieldSize: 10 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserEntity,
    @Param('modelId', ParseUUIDPipe) modelId: string,
    @Query('typeId') typeId: string,
    @Query('folder') folder: string,
  ): Promise<ResponseHttpInterface> {
    const response = await this.filesService.uploadFile({
      file,
      user,
      modelId,
      typeId,
      folder,
    });

    return {
      data: response,
      message: 'Archivo Subido Correctamente',
      title: 'Archivo Subido',
    };
  }

  @ApiOperation({ summary: 'Upload Files' })
  @Post(':modelId/uploads')
  @UseInterceptors(
    FilesInterceptor('files[]', 10, {
      storage: diskStorage({
        destination: join(
          process.cwd(),
          'storage/private/uploads',
          `${new Date().getFullYear()}/${new Date().getMonth()}`,
        ),
        filename: getFileName,
      }),
      fileFilter: fileFilter,
      limits: { fieldSize: 10 },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Query('modelId', ParseUUIDPipe) modelId: string,
    @Body('typeIds', ParseUUIDPipe) typeIds: string[],
    @User() user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    await this.filesService.uploadFiles(files, modelId, typeIds, user.id);

    return {
      data: null,
      message: 'Archivos Subidos Correctamente',
      title: 'Archivos Subidos',
    };
  }

  @ApiOperation({ summary: 'Download File' })
  @Get(':id/url')
  async findUrl(
    @Param('id') id: number,
    @User() user: UserEntity,
    @Req() req: Request,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.filesService.findUrl(id, user, req);

    return {
      data: serviceResponse,
      message: 'Find Url',
      title: 'Find',
    };
  }

  @ApiOperation({ summary: 'Download File' })
  @Get(':id/download')
  async download(
    @Param('id') id: number,
    @User() user: UserEntity,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.filesService.download(id, user, req, res);
  }

  @ApiOperation({ summary: 'Find By Model' })
  @Get('interfaces/:modelId')
  async findByModel(
    @Param('modelId', ParseUUIDPipe) modelId: string,
    @Query() params: FilterFileDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.filesService.findByModel(modelId, params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Find Files',
      title: 'Find By Model',
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: number): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.filesService.remove(id);

    return {
      data: serviceResponse,
      message: 'Archivo Eliminado',
      title: 'Eliminado',
    };
  }
}
