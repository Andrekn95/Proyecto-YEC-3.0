import { DataSource } from 'typeorm';
import {
  MenuEntity,
  TransactionalCodeEntity,
  PermissionEntity,
  RoleEntity,
  UserEntity,
  EmailVerificationsEntity,
} from '@auth/entities';
import { ConfigEnum, AuthRepositoryEnum } from '@utils/enums';
import { SecurityQuestionEntity } from '@auth/entities/security-question.entity';

export const authProviders = [
  {
    provide: AuthRepositoryEnum.menuRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MenuEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.permissionRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.roleRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RoleEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.userRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.transactionalCodeRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionalCodeEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.securityQuestionRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SecurityQuestionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: AuthRepositoryEnum.emailVerificationRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EmailVerificationsEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];
