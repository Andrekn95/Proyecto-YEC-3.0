import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';
import { UserEntity } from '@auth/entities';
import { AuthRepositoryEnum } from '@utils/enums';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { PayloadTokenInterface } from '@auth/interfaces';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(envConfig.KEY) config: ConfigType<typeof envConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.refreshSecret!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: PayloadTokenInterface) {
    const refreshToken = req.headers.authorization?.split(' ')[1];

    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: { id: true, refreshToken: true },
    });

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isValid = await Bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
