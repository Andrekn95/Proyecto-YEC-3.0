import { IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { CatalogueStateEnum, CatalogueTypeEnum } from '@utils/enums';
import {
  isEnumValidationOptions,
  isNotEmptyValidationOptions,
  isNumberValidationOptions,
  isStringValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';

export class BaseCatalogueDto {
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

  @IsEnum(CatalogueStateEnum, isEnumValidationOptions())
  readonly state: CatalogueStateEnum;

  @IsEnum(isStringValidationOptions())
  readonly type: CatalogueTypeEnum;
}
