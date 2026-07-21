import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterface } from '@utils/interfaces';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { CreateCatalogueDto, UpdateCatalogueDto } from '@modules/common/catalogue/dto';
import { Auth, PublicRoute } from '@auth/decorators';
import { PaginationDto } from '@utils/pagination';
import { RoleEnum } from '@auth/enums';

@ApiTags('Catalogues')
@Auth(RoleEnum.admin)
@Controller('common/catalogues')
export class CatalogueController {
  constructor(private catalogueService: CataloguesService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Find Cache' })
  @Get('cache')
  async findCache(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.findCache();

    return {
      data: serviceResponse,
      message: `Cache de Catalogos`,
      title: `Cache`,
    };
  }

  @ApiOperation({ summary: 'Load Cache' })
  @Patch('cache')
  async loadCache(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.loadCache();

    return {
      data: serviceResponse,
      message: `Cache Cargada`,
      title: `Cargada`,
    };
  }

  @ApiOperation({ summary: 'Create' })
  @Post()
  async create(@Body() payload: CreateCatalogueDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.create(payload);

    return {
      data: serviceResponse,
      message: 'created',
      title: '',
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  async findAll(@Query() params: PaginationDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: '',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.findOne(id);

    return {
      data: serviceResponse,
      message: `show ${id}`,
      title: `Success`,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCatalogueDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.update(id, payload);

    return {
      data: serviceResponse,
      message: `Registro Actualizado`,
      title: `Actualizado`,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.delete(id);

    return {
      data: serviceResponse,
      message: `Registro Eliminado`,
      title: `Eliminado`,
    };
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Find Model Catalogues' })
  @Get('model-catalogues/cache')
  async findCacheModelCatalogues(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.findCacheModelCatalogues();

    return {
      data: serviceResponse,
      message: `Model Catalogues`,
      title: `Find`,
    };
  }

  @ApiOperation({ summary: 'Load Cache' })
  @Patch('model-catalogues/cache')
  async loadCacheModelCatalogues(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.catalogueService.loadCacheModelCatalogues();

    return {
      data: serviceResponse,
      message: `Cache Model Catalogues Cargada`,
      title: `Cargada`,
    };
  }
}
