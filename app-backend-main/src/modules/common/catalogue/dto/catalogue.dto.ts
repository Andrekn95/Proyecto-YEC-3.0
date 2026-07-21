import { IsOptional, IsString, IsUUID } from 'class-validator';
import { isStringValidationOptions } from '@utils/dto-validation';

export class CatalogueDto {
  @IsUUID()
  readonly id: string;

  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly name: string;
}
