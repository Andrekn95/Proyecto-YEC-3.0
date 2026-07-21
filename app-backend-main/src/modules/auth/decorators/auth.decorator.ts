import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '@auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleEnum } from '@auth/enums';
import { Roles } from '@auth/decorators/roles.decorator';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(ApiBearerAuth(), Roles(...roles), UseGuards(JwtGuard, RolesGuard));
}
