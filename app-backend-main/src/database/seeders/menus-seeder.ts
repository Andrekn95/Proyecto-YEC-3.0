import { Injectable } from '@nestjs/common';
import { MenuTypeEnum, RoleEnum } from '@auth/enums';
import { MenusService } from '@auth/services/menus.service';
import { RolesService } from '@auth/services/roles.service';
import { MenuEntity } from '@auth/entities';

@Injectable()
export class MenusSeeder {
  constructor(
    private menusService: MenusService,
    private rolesService: RolesService,
  ) {}

  async run() {
    await this.createMenus();
    await this.createMenuRole();
  }

  private async createMenus() {
    let menus: any[] = [];

    /** Admin Role **/

    menus = [];
    menus.push(
      {
        code: 'users',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Usuarios',
        sort: 1,
        routerLink: '/admin/users',
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: 'menus',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Menus',
        sort: 2,
        routerLink: '/admin/menus',
        type: MenuTypeEnum.LEFT_SIDE,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }
  }

  private async createMenuRole() {
    const menusAll = (await this.menusService.findAll()).data;

    if (Array.isArray(menusAll)) {
      const role = await this.rolesService.findByCode(RoleEnum.admin);

      role.menus = menusAll.filter((menu) => menu?.code === RoleEnum.admin) as MenuEntity[];
      await this.rolesService.createMenus(role);
    }
  }
}
