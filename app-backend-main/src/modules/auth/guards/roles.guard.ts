import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE_KEY, ROLES_KEY } from '@auth/constants';
import { ErrorCodeEnum, RoleEnum } from '@auth/enums';
import { UserEntity } from '@auth/entities';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si el endpoint no requiere roles, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const user = req.user as UserEntity;

    // Si no tiene roles asignados
    if (!Array.isArray(user.roles)) {
      throw new ForbiddenException('El usuario no tiene roles asignados');
    }

    const hasPermission = requiredRoles.some((required) =>
      user.roles.some((userRole) => userRole.code === required),
    );

    if (!hasPermission) {
      throw new ForbiddenException({
        error: ErrorCodeEnum.INSUFFICIENT_PERMISSIONS,
        message: 'El usuario no tiene permisos para esta acción',
      });
    }

    return true;
  }
}
