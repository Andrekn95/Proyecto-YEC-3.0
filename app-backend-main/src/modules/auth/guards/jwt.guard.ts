import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ROUTE_KEY } from '@auth/constants';
import { ErrorCodeEnum } from '@auth/enums';
import { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(
    err: Error | null,
    user: TUser | false,
    info: JsonWebTokenError | TokenExpiredError | Error | undefined,
  ): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        error: ErrorCodeEnum.EXPIRED_TOKEN,
        message: ErrorCodeEnum.EXPIRED_TOKEN,
      });
    }

    if (err || !user) {
      throw new HttpException('Mensaje', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    // Seguridad extra: asegurar que exista usuario
    const request = context.switchToHttp().getRequest<Request>();
    return !!request.user;
  }
}
