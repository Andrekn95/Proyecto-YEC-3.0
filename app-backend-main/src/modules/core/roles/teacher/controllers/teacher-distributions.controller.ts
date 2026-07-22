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
import { PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { TeacherDistributionsService } from '@modules/core/roles/teacher/services/teacher-distributions.service';
import {
  CreateTeacherDistributionDto,
  FilterTeacherDistributionDto,
  UpdateTeacherDistributionDto,
} from '@modules/core/roles/teacher/dto';

@ApiTags('Teacher Distributions')
@PublicRoute()
@Controller('teacher-distributions')
export class TeacherDistributionsController {
  constructor(private readonly service: TeacherDistributionsService) {}

  @ApiOperation({ summary: 'Find All Teacher Distributions' })
  @Get()
  async findAll(@Query() params: FilterTeacherDistributionDto): Promise<ResponseHttpInterface> {
    const response = await this.service.findAll(params);
    return {
      data: response.data,
      pagination: response.pagination,
      message: 'Distribuciones docentes',
      title: 'Consultado',
    };
  }

  @ApiOperation({ summary: 'Find Enrolled Counts' })
  @Get('enrolled-counts')
  async findEnrolledCounts(@Query('ids') ids: string): Promise<ResponseHttpInterface> {
    const idList = ids ? ids.split(',') : [];
    const response = await this.service.findEnrolledCounts(idList);
    return { data: response, message: 'Conteo de matriculados', title: 'Consultado' };
  }

  @ApiOperation({ summary: 'Find One Teacher Distribution' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.findOne(id);
    return { data: response, message: 'Distribución docente', title: 'Consultado' };
  }

  @ApiOperation({ summary: 'Create Teacher Distribution' })
  @Post()
  async create(@Body() payload: CreateTeacherDistributionDto): Promise<ResponseHttpInterface> {
    const response = await this.service.create(payload);
    return {
      data: [response],
      message: 'La distribución se creó correctamente',
      title: 'Creado',
    };
  }

  @ApiOperation({ summary: 'Update Teacher Distribution' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateTeacherDistributionDto,
  ): Promise<ResponseHttpInterface> {
    const response = await this.service.update(id, payload);
    return {
      data: [response],
      message: 'La distribución se actualizó correctamente',
      title: 'Actualizado',
    };
  }

  @ApiOperation({ summary: 'Remove Teacher Distribution' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const response = await this.service.remove(id);
    return {
      data: response,
      message: 'La distribución se eliminó correctamente',
      title: 'Eliminado',
    };
  }
}
