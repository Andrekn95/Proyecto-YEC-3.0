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
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '@auth/dto';
import { RoleEntity } from '@auth/entities';
import { ResponseHttpInterface } from '@utils/interfaces';
import { RolesService } from '@auth/services/roles.service';

@ApiTags('Roles')
@Controller('auth/roles')
export class RolesController {
  constructor(private service: RolesService) {}

  @ApiOperation({ summary: 'Create One' })
  @Post()
  async create(@Body() payload: CreateRoleDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Role created',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Catalogues' })
  @Get('catalogues')
  async catalogue(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.catalogue();

    return {
      data: serviceResponse,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  async findAll(@Query() params: FilterRoleDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findAll(params);

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
    const serviceResponse = await this.service.findOne(id);

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
    @Body() payload: UpdateRoleDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.update(id, payload);

    return {
      data: serviceResponse.data,
      message: `Role updated ${id}`,
      title: `Updated`,
    };
  }

  @ApiOperation({ summary: 'Remove One' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.remove(id);

    return {
      data: serviceResponse.data,
      message: `Role deleted ${id}`,
      title: `Deleted`,
    };
  }

  @ApiOperation({ summary: 'Remove All' })
  @Patch('remove-all')
  async removeAll(@Body() payload: RoleEntity[]): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Roles deleted`,
      title: `Deleted`,
    };
  }
}
