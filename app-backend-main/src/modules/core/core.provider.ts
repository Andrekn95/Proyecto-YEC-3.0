import { CoreRepositoryEnum } from '@modules/core/shared-core/enums';
import { DataSource } from 'typeorm';
import {
  CareerEntity,
  StudentEntity,
  SchoolPeriodEntity,
  ClassroomEntity,
  SubjectEntity,
  TeacherDistributionEntity,
  CatalogueEntity,
} from '@modules/core/entities';
import { ConfigEnum } from '@utils/enums';

export const coreProviders = [
  {
    provide: CoreRepositoryEnum.studentRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(StudentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.careerRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CareerEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.schoolPeriodRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SchoolPeriodEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.classroomRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ClassroomEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.subjectRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SubjectEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.teacherDistributionRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TeacherDistributionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.catalogueRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CatalogueEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];
