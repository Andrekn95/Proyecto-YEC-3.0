import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { SubjectEntity } from '@modules/core/entities';
import { PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';

@ApiTags('Subjects')
@PublicRoute()
@Controller('careers')
export class SubjectsController {
  constructor(
    @Inject(CoreRepositoryEnum.subjectRepository)
    private readonly repository: Repository<SubjectEntity>,
  ) {}

  @ApiOperation({ summary: 'Find Subjects By Career' })
  @Get(':careerId/subjects')
  async findByCareer(
    @Param('careerId', ParseUUIDPipe) careerId: string,
  ): Promise<ResponseHttpInterface> {
    const data = await this.repository.find({
      relations: { academicPeriod: true, career: true },
      where: { careerId, isVisible: true },
      order: { name: 'ASC' },
    });
    return { data, message: 'Materias por carrera', title: 'Consultado' };
  }
}
