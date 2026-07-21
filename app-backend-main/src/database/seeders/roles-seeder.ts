import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@auth/dto';
import { RoleEnum } from '@auth/enums';
import { RolesService } from '@auth/services/roles.service';
import { FontAwesome } from '@utils/api/font-awesome';

@Injectable()
export class RolesSeeder {
  constructor(private rolesService: RolesService) {}

  async run() {
    await this.createRoles();
  }

  private async createRoles() {
    const roles: CreateRoleDto[] = [];
    roles.push(
      {
        code: RoleEnum.admin,
        name: 'Administrador',
        icon: FontAwesome.USER_GEAR_SOLID,
      },
      {
        code: RoleEnum.student,
        name: 'Estudiante',
        icon: FontAwesome.BLACK_TIE_BRAND,
      },
      {
        code: RoleEnum.teacher,
        name: 'Docente',
        icon: FontAwesome.USER_SOLID,
      },
    );

    for (const role of roles) {
      await this.rolesService.create(role);
    }
  }
}
