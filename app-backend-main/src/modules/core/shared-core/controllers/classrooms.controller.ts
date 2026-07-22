import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { ClassroomEntity } from '@modules/core/entities';
import { PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';

@ApiTags('Classrooms')
@PublicRoute()
@Controller('classrooms')
export class ClassroomsController {
  constructor(
    @Inject(CoreRepositoryEnum.classroomRepository)
    private readonly repository: Repository<ClassroomEntity>,
  ) {}

  @ApiOperation({ summary: 'Find All Classrooms' })
  @Get()
  async findAll(): Promise<ResponseHttpInterface> {
    const data = await this.repository.find({
      order: { name: 'ASC' },
    });
    return { data, message: 'Aulas', title: 'Consultado' };
  }
}
