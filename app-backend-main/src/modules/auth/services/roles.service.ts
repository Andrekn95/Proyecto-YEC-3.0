import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { MenuEntity, RoleEntity } from '@auth/entities';
import { PaginationDto } from '@utils/pagination';
import { ServiceResponseHttpInterface } from '../../../utils/interfaces';
import { AuthRepositoryEnum } from '../../../utils/enums';
import { CreateRoleDto, FilterRoleDto, ReadRoleDto, UpdateRoleDto } from '@auth/dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(AuthRepositoryEnum.roleRepository)
    private repository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateRoleDto): Promise<ServiceResponseHttpInterface> {
    const newRole = this.repository.create(payload);
    const roleCreated = await this.repository.save(newRole);

    return { data: plainToInstance(ReadRoleDto, roleCreated) };
  }

  async createMenus(role: RoleEntity): Promise<RoleEntity> {
    return await this.repository.save(role);
  }

  async catalogue(): Promise<RoleEntity[]> {
    return await this.repository.find();
  }

  async findAll(params?: FilterRoleDto): Promise<ServiceResponseHttpInterface> {
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
      data: plainToInstance(ReadRoleDto, response[0]),
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findOne(id: string): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found, findOne');
    }

    return { data: plainToInstance(ReadRoleDto, role) };
  }

  async findByCode(code: string): Promise<RoleEntity> {
    const role = await this.repository.findOneBy({ code });

    if (!role) {
      throw new NotFoundException('Role not found, findByCode');
    }

    return role;
  }

  async update(id: string, payload: UpdateRoleDto): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.preload({ id, ...payload });

    if (!role) {
      throw new NotFoundException('Role not found, update');
    }

    const roleUpdated = await this.repository.save(role);

    return { data: plainToInstance(ReadRoleDto, roleUpdated) };
  }

  async remove(id: string): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found, remove');
    }

    const roleDeleted = await this.repository.softRemove(role);

    return { data: plainToInstance(ReadRoleDto, roleDeleted) };
  }

  async removeAll(payload: RoleEntity[]): Promise<ServiceResponseHttpInterface> {
    const rolesDeleted = await this.repository.softRemove(payload);
    return { data: rolesDeleted };
  }

  private async paginateAndFilter(params: FilterRoleDto): Promise<ServiceResponseHttpInterface> {
    let where: FindOptionsWhere<RoleEntity> | FindOptionsWhere<RoleEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ code: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
    }

    const response = await this.repository.findAndCount({
      where,
      order: {
        updatedAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReadRoleDto, response[0]),
      pagination: { limit, totalItems: response[1] },
    };
  }
}
