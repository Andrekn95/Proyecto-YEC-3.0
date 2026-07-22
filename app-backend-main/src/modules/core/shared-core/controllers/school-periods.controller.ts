import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { SchoolPeriodEntity } from '@modules/core/entities';
import { PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';

@ApiTags('School Periods')
@PublicRoute()
@Controller('school-periods')
export class SchoolPeriodsController {
  constructor(
    @Inject(CoreRepositoryEnum.schoolPeriodRepository)
    private readonly repository: Repository<SchoolPeriodEntity>,
  ) {}

  @ApiOperation({ summary: 'Find All School Periods' })
  @Get()
  async findAll(): Promise<ResponseHttpInterface> {
    const data = await this.repository.find({
      where: { isVisible: true },
      order: { startedAt: 'DESC' },
    });
    return { data, message: 'Periodos escolares', title: 'Consultado' };
  }
}
