import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCodeEnum } from '@auth/enums';
import { Request } from 'express';
import { UserEntity } from '@auth/entities';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity;

    if (!user) return true;

    if (user.suspendedAt) {
      throw new ForbiddenException({
        error: ErrorCodeEnum.ACCOUNT_SUSPENDED,
        message: 'La cuenta del usuario está suspendida',
      });
    }

    return true;
  }
}
