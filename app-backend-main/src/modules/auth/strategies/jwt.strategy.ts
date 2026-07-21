import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';
import { PayloadTokenInterface } from 'src/modules/auth/interfaces';
import { UserEntity } from '@auth/entities';
import { AuthRepositoryEnum } from '@utils/enums';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly repository: Repository<UserEntity>,
    @Inject(envConfig.KEY) readonly configService: ConfigType<typeof envConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.secret!,
    });
  }

  async validate(payload: PayloadTokenInterface): Promise<UserEntity> {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .addSelect('roles.code')
      .where('user.id = :id', { id: payload.sub })
      .select([
        'user.id',
        'user.suspendedAt',
        'user.maxAttempts',
        'user.emailVerifiedAt',
        'roles.code',
      ])
      .getOne();

    if (!user) throw new UnauthorizedException('El Usuario no existe.');

    return user;
  }
}
