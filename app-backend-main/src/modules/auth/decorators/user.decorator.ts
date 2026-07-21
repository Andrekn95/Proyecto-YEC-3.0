import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '@auth/entities';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user as UserEntity;

  if (!user) throw new InternalServerErrorException('User no found');

  return data ? user[data as keyof UserEntity] : user;
});
