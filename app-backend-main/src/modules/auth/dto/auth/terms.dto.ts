import { IsBoolean, IsNotEmpty } from 'class-validator';
import { FieldLabel, isBooleanValidationOptions } from '@utils/dto-validation';

export class TermsDto {
  @FieldLabel('Aceptación de términos y condiciones')
  @IsNotEmpty()
  @IsBoolean(isBooleanValidationOptions())
  termsAcceptedAt: boolean;
}
