import { Inject, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { AuthRepositoryEnum, CatalogueTypeEnum } from '@utils/enums';
import { RoleEntity, UserEntity } from '@auth/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { RolesService } from '@auth/services/roles.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersSeeder {
  private identificationTypes: CatalogueEntity[] = [];
  private roles: RoleEntity[] = [];

  constructor(
    private rolesService: RolesService,
    @Inject(AuthRepositoryEnum.userRepository)
    private userRepository: Repository<UserEntity>,
    private cataloguesService: CataloguesService,
  ) {}

  async run() {
    await this.loadRoles();
    await this.loadCatalogues();
    await this.createUsers();
  }

  async loadRoles() {
    this.roles = (await this.rolesService.findAll()).data as RoleEntity[];
  }

  async loadCatalogues() {
    const catalogues = await this.cataloguesService.findCache();

    this.identificationTypes = catalogues.filter(
      (catalogue) => catalogue.type === CatalogueTypeEnum.users_identification_type,
    );
  }

  async createUsers() {
    const roles = this.roles;

    const users = this.userRepository.create({
      birthdate: faker.date.birthdate(),
      cellPhone: '0987654321',
      identification: 'admin',
      email: 'admin@admin.com',
      lastname: 'Perez',
      name: 'Admin',
      password: 'admin',
      passwordChanged: false,
      emailVerifiedAt: new Date(),
      personalEmail: faker.internet.email(),
      roles: roles,
      username: 'admin',
    });

    await this.userRepository.save(users);
  }
}
