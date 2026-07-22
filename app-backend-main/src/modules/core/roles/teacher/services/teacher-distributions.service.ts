import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConfigEnum } from '@utils/enums';
import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { TeacherDistributionEntity } from '@modules/core/entities';
import {
  CreateTeacherDistributionDto,
  FilterTeacherDistributionDto,
  UpdateTeacherDistributionDto,
} from '@modules/core/roles/teacher/dto';
import { QueryBuilderHelper } from '@modules/core/shared-core/helpers';

@Injectable()
export class TeacherDistributionsService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE) private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.teacherDistributionRepository)
    private readonly repository: Repository<TeacherDistributionEntity>,
  ) {}

  async findAll(params: FilterTeacherDistributionDto) {
    const query = this.repository.createQueryBuilder('td')
      .leftJoinAndSelect('td.parallel', 'parallel')
      .leftJoinAndSelect('td.schoolPeriod', 'schoolPeriod')
      .leftJoinAndSelect('td.subject', 'subject')
      .leftJoinAndSelect('subject.academicPeriod', 'academicPeriod')
      .leftJoinAndSelect('subject.career', 'career')
      .leftJoinAndSelect('td.workday', 'workday')
      .leftJoinAndSelect('td.teacher', 'teacher')
      .leftJoinAndSelect('td.classroom', 'classroom');

    if (params.careerId) {
      query.andWhere('career.id = :careerId', { careerId: params.careerId });
    }

    if (params.schoolPeriodId) {
      query.andWhere('td.schoolPeriodId = :schoolPeriodId', { schoolPeriodId: params.schoolPeriodId });
    }

    if (params.subjectId) {
      query.andWhere('td.subjectId = :subjectId', { subjectId: params.subjectId });
    }

    if (params.parallelId) {
      query.andWhere('td.parallelId = :parallelId', { parallelId: params.parallelId });
    }

    if (params.workdayId) {
      query.andWhere('td.workdayId = :workdayId', { workdayId: params.workdayId });
    }

    QueryBuilderHelper.applySearch(query, 'td', ['capacity'], params.search);
    if (params.sort) {
      QueryBuilderHelper.applySorting(query, 'td', params.sort, params.order);
    }

    if (params.page && params.limit) {
      QueryBuilderHelper.applyPagination(query, params.page, params.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { pagination: { totalItems: total, limit: params.limit }, data };
  }

  async findOne(id: string): Promise<TeacherDistributionEntity> {
    const entity = await this.repository.findOne({
      relations: [
        'parallel',
        'schoolPeriod',
        'subject',
        'subject.academicPeriod',
        'subject.career',
        'workday',
        'teacher',
        'classroom',
      ],
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`La distribución con id: ${id} no se encontró`);
    }

    return entity;
  }

  async create(payload: CreateTeacherDistributionDto): Promise<TeacherDistributionEntity> {
    const newEntity = this.repository.create(payload);
    const saved = await this.repository.save(newEntity);
    return await this.findOne(saved.id);
  }

  async update(id: string, payload: UpdateTeacherDistributionDto): Promise<TeacherDistributionEntity> {
    const entity = await this.findOne(id);
    this.repository.merge(entity, payload);
    const saved = await this.repository.save(entity);
    return await this.findOne(saved.id);
  }

  async remove(id: string): Promise<TeacherDistributionEntity> {
    const entity = await this.findOne(id);
    return await this.repository.softRemove(entity);
  }

  async findEnrolledCounts(ids: string[]): Promise<Record<string, number>> {
    if (!ids.length) return {};

    const result: Record<string, number> = {};
    for (const id of ids) {
      result[id] = 0;
    }
    return result;
  }
}
