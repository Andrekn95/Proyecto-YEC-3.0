import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseSeeder, MenusSeeder, RolesSeeder, UsersSeeder } from '@database/seeders';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { CataloguesSeeder } from '@database/seeders/catalogues-seeder';

@Global()
@Module({
  imports: [CatalogueModule],
  providers: [
    ...databaseProviders,
    DatabaseSeeder,
    CataloguesSeeder,
    UsersSeeder,
    RolesSeeder,
    MenusSeeder,
  ],
  exports: [...databaseProviders, DatabaseSeeder],
})
export class DatabaseModule {}
