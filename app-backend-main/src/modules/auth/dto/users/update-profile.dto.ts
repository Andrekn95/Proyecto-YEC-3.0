import { PickType } from '@nestjs/swagger';
import { UserDto } from '@auth/dto';
import { IsOptional, IsString } from 'class-validator';
import { isStringValidationOptions } from '@utils/dto-validation';

export class UpdateProfileDto extends PickType(UserDto, [
  'avatar',
  'identificationType',
  'birthdate',
  'identification',
  'name',
  'email',
  'personalEmail',
  'cellPhone',
  'phone',
  'nationality',
  'sex',
  'username',
  'emailVerifiedAt',
]) {
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly lastname: string;
}
