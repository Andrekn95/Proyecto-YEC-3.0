import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@auth/decorators';
import { CreateMenuDto, FilterMenuDto, UpdateMenuDto } from '@auth/dto';
import { MenuEntity } from '@auth/entities';
import { ResponseHttpInterface } from '../../../utils/interfaces';
import { MenusService } from '@auth/services/menus.service';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @ApiOperation({ summary: 'Create One' })
  @Post()
  async create(@Body() payload: CreateMenuDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Menu created',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  async catalogue(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Menus for sidebar' })
  @Get('sidebar')
  async getMenusForSidebar(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.getMenusForSidebar();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Menus for sidebar' })
  @Get('roles/:roleId')
  async getMenusByRole(@Param('roleId') roleId: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.getMenusByRole(roleId);

    return {
      data: serviceResponse.data,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  async findAll(@Query() params: FilterMenuDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `show ${id}`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update One' })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateMenuDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.update(id, payload);

    return {
      data: serviceResponse.data,
      message: `Menu updated ${id}`,
      title: `Updated`,
    };
  }

  @ApiOperation({ summary: 'Remove One' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.remove(id);

    return {
      data: serviceResponse.data,
      message: `Menu deleted ${id}`,
      title: `Deleted`,
    };
  }

  @ApiOperation({ summary: 'Remove All' })
  @Patch('remove-all')
  async removeAll(@Body() payload: MenuEntity[]): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.menusService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Menus deleted`,
      title: `Deleted`,
    };
  }
}
