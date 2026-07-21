import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import {
  isNotEmptyValidationOptions,
  isNumberValidationOptions,
  isStringValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';

export class DpaDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsString(isStringValidationOptions())
  @MinLength(5, minLengthValidationOptions())
  readonly description: string;

  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsNumber({}, isNumberValidationOptions())
  readonly sort: number;
}
