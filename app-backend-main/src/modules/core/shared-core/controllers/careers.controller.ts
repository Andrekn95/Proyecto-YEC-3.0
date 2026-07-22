import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { CareerEntity } from '@modules/core/entities';
import { PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';

@ApiTags('Careers Public')
@PublicRoute()
@Controller('careers')
export class CareersController {
  constructor(
    @Inject(CoreRepositoryEnum.careerRepository)
    private readonly repository: Repository<CareerEntity>,
  ) {}

  @ApiOperation({ summary: 'Find All Careers (public)' })
  @Get()
  async findAll(): Promise<ResponseHttpInterface> {
    const data = await this.repository.find({
      where: { isVisible: true },
      order: { name: 'ASC' },
    });
    return { data, message: 'Carreras', title: 'Consultado' };
  }
}
