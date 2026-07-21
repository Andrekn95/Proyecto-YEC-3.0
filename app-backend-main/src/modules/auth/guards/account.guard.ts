import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '@auth/entities';
import { AuthRepositoryEnum } from '@utils/enums';
import { IS_PUBLIC_ROUTE_KEY } from '@auth/constants';
import { Reflector } from '@nestjs/core';
import { ErrorCodeEnum } from '@auth/enums';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthRepositoryEnum.userRepository)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    const user = req.user as UserEntity;

    if (user.suspendedAt) {
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_SUSPENDED,
        message: 'La cuenta del usuario está suspendida',
      });
    }

    if (user.maxAttempts === 0)
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_LOCKED,
        message: "'Ha excedido el número máximo de intentos permitidos'",
      });

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_UNVERIFIED_EMAIL,
        message: 'Aún no has verificado tu correo electrónico',
      });
    }

    return true;
  }
}
