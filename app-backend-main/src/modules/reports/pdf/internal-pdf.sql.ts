import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum } from '@utils/enums';

import { UserEntity } from '@auth/entities';

@Injectable()
export class InternalPdfSql {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUsers(): Promise<any> {
    const users = await this.userRepository.createQueryBuilder('users').getRawMany();

    return {
      users,
    };
  }
}
