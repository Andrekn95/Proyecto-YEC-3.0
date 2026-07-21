import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { MenusSeeder, RolesSeeder, UsersSeeder } from '@database/seeders';
import { CataloguesSeeder } from '@database/seeders/catalogues-seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private cataloguesSeeder: CataloguesSeeder,
    private usersSeeder: UsersSeeder,
    private rolesSeeder: RolesSeeder,
    private menusSeeder: MenusSeeder,
  ) {}

  async run() {
    /** Auth Seeders **/
    await this.cataloguesSeeder.run();
    await this.rolesSeeder.run();
    await this.usersSeeder.run();
    await this.menusSeeder.run();
    this.createUploadsDirectories();
  }

  createUploadsDirectories() {
    const date = new Date();
    for (let i = date.getFullYear(); i < date.getFullYear() + 20; i++) {
      const path = join(process.cwd(), 'storage/private/uploads', i.toString());
      fs.mkdir(path, (err) => {
        if (err) {
          // console.error(err);
        }
      });

      for (let j = 1; j <= 12; j++) {
        const path = join(process.cwd(), 'storage/private/uploads', i.toString());
        fs.mkdir(path, (err) => {
          if (err) {
            // console.error(err);
          }
        });
      }
    }
  }
}
