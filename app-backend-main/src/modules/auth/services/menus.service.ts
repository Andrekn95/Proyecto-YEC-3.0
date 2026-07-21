import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { MenuEntity, RoleEntity } from '@auth/entities';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { AuthRepositoryEnum } from '@utils/enums';
import { CreateMenuDto, FilterMenuDto, ReadMenuDto, UpdateMenuDto } from '@auth/dto';
import { PaginationDto } from '@utils/pagination';

@Injectable()
export class MenusService {
  constructor(
    @Inject(AuthRepositoryEnum.menuRepository)
    private repository: Repository<MenuEntity>,
    @Inject(AuthRepositoryEnum.roleRepository)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateMenuDto): Promise<ServiceResponseHttpInterface> {
    const newMenu = this.repository.create(payload);
    const menuCreated = await this.repository.save(newMenu);

    return { data: plainToInstance(ReadMenuDto, menuCreated) };
  }

  async catalogue(): Promise<ServiceResponseHttpInterface> {
    const response = await this.repository.findAndCount({ take: 1000 });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async getMenusForSidebar(): Promise<ServiceResponseHttpInterface> {
    const response = await this.repository.find({
      where: { parent: IsNull() },
      relations: { children: true, parent: true },
    });

    // response = response.filter((element) => element.parent === null);

    return {
      data: response,
    };
  }

  async getMenusByRole(roleId: string): Promise<ServiceResponseHttpInterface> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, menus: { parent: IsNull() } },
      relations: { menus: { parent: true, children: { children: true } } },
    });

    return {
      data: role?.menus,
    };
  }

  async findAll(params?: FilterMenuDto): Promise<ServiceResponseHttpInterface> {
    //Pagination & Filter by Search
    if (params && params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Other filters
    // if (params.birthdate) {
    //   return this.filterByBirthdate(params.birthdate);
    // }

    //All
    const response = await this.repository.findAndCount({
      order: { updatedAt: 'DESC' },
    });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findOne(id: string): Promise<ServiceResponseHttpInterface> {
    const menu = await this.repository.findOneBy({ id });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return { data: plainToInstance(ReadMenuDto, menu) };
  }

  async update(id: string, payload: UpdateMenuDto): Promise<ServiceResponseHttpInterface> {
    const menu = await this.repository.preload({ id, ...payload });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const menuUpdated = await this.repository.save(menu);

    return { data: plainToInstance(ReadMenuDto, menuUpdated) };
  }

  async remove(id: string): Promise<ServiceResponseHttpInterface> {
    const menu = await this.repository.findOneBy({ id });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    const menuDeleted = await this.repository.softRemove(menu);

    return { data: plainToInstance(ReadMenuDto, menuDeleted) };
  }

  async removeAll(payload: MenuEntity[]): Promise<ServiceResponseHttpInterface> {
    const menusDeleted = await this.repository.softRemove(payload);
    return { data: menusDeleted };
  }

  private async paginateAndFilter(params: FilterMenuDto): Promise<ServiceResponseHttpInterface> {
    let where: FindOptionsWhere<MenuEntity> | FindOptionsWhere<MenuEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ label: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      where,
      order: {
        updatedAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReadMenuDto, response[0]),
      pagination: { limit, totalItems: response[1] },
    };
  }
}
