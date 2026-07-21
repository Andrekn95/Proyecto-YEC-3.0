import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from '@auth/decorators';
import { RoleEnum } from '@auth/enums';
import { ResponseHttpInterface } from '@utils/interfaces';
import {
  CreateCareerDto,
  FilterCareerDto,
  UpdateCareerDto,
} from '@modules/core/roles/career-coordinator/dto';
import { CareersService } from '@modules/core/roles/career-coordinator/services/careers.service';

@ApiTags('Careers')
@Auth()
@Controller('core/career-coordinator/careers')
export class CareersController {
  constructor(private readonly service: CareersService) {}

  @ApiOperation({ summary: 'Find All Careers' })
  @Get()
  @Roles(RoleEnum.admin)
  async findAll(@Query() params: FilterCareerDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);

    return {
      data: response.data,
      pagination: response.pagination,
      message: `Carreras`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Find One Career' })
  @Get(':id')
  @Roles(RoleEnum.admin)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);

    return {
      data: response,
      message: `Carrera`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Create Career' })
  @Post()
  @Roles(RoleEnum.admin)
  async create(@Body() createUserDto: CreateCareerDto): Promise<ResponseHttpInterface> {
    const response = await this.service.create(createUserDto);

    return {
      data: response,
      message: `La carrera se creó correctamente`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Update Career' })
  @Patch(':id')
  @Roles(RoleEnum.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateCareerDto,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.update(id, updateUserDto);

    return {
      data: response,
      message: `La carrera se actulizó correctamente`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Delete Career' })
  @Delete(':id')
  @Roles(RoleEnum.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.remove(id);

    return {
      data: response,
      message: `La carrera se actulizó correctamente`,
      title: `Actualizado`,
    };
  }
}
