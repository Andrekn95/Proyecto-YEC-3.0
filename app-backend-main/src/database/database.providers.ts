import { DataSource } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { ConfigEnum } from '../utils/enums';
import { envConfig } from '@config';
import { AuditSubscriber } from '@modules/audit/audit.subscriber';

export const databaseProviders = [
  {
    provide: ConfigEnum.PG_DATA_SOURCE,
    inject: [envConfig.KEY],
    useFactory: async (configService: ConfigType<typeof envConfig>) => {
      const { username, host, database, password, port } = configService.database;
      const dataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: ['src/database/migrations/*.ts'],
        migrationsTableName: 'migrations',
        // dropSchema: true,
        synchronize: false,
        subscribers: [AuditSubscriber],
      });

      await dataSource.initialize();

      await dataSource.query(`CREATE SCHEMA IF NOT EXISTS auth`);
      await dataSource.query(`CREATE SCHEMA IF NOT EXISTS common`);
      await dataSource.query(`CREATE SCHEMA IF NOT EXISTS core`);

      await dataSource.synchronize();

      return dataSource;
    },
  },
];
