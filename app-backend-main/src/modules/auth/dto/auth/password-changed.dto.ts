import { IsNotEmpty, IsString } from 'class-validator';
import { FieldLabel, isStringValidationOptions } from '@utils/dto-validation';
import { MatchPasswords } from '@utils/dto-validation/custom-validation';

export class PasswordChangedDto {
  @FieldLabel('Contraseña')
  @IsNotEmpty()
  @IsString(isStringValidationOptions())
  password: string;

  @FieldLabel('Confirmación de Contraseña')
  @IsNotEmpty()
  @MatchPasswords('password', { message: 'Las contraseñas no coinciden' })
  @IsString(isStringValidationOptions())
  passwordConfirm: string;
}
