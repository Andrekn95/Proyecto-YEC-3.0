import { IsNotEmpty, IsString } from 'class-validator';
import {
  FieldLabel,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
} from '@utils/dto-validation';

export class SignInDto {
  @FieldLabel('Nombre de usuario')
  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  username: string;

  @FieldLabel('Contraseña')
  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  password: string;
}
