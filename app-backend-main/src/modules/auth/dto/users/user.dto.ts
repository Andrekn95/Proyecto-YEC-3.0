import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  isBooleanValidationOptions,
  isDateValidationOptions,
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  maxLengthValidationOptions,
  minLengthValidationOptions,
} from '@utils/dto-validation';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { Type } from 'class-transformer';

export class UserDto {
  @IsOptional()
  readonly bloodType: CatalogueEntity;

  @IsOptional()
  readonly ethnicOrigin: CatalogueEntity;

  @IsOptional()
  readonly identificationType: CatalogueEntity;

  @IsOptional()
  readonly gender: CatalogueEntity;

  @IsOptional()
  readonly maritalStatus: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly sex: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly nationality: CatalogueEntity;

  @IsOptional()
  readonly avatar: string;

  @Type(() => Date)
  @IsDate(isDateValidationOptions())
  readonly birthdate: Date;

  @IsOptional()
  @MaxLength(10, maxLengthValidationOptions())
  readonly cellPhone: string;

  @IsString(isStringValidationOptions())
  readonly identification: string;

  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly email: string;

  @Type(() => Date)
  @IsDate(isDateValidationOptions())
  readonly emailVerifiedAt: Date;

  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly lastname: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  @MinLength(8, minLengthValidationOptions())
  @MaxLength(32, minLengthValidationOptions())
  readonly password: string;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly passwordChanged: boolean;

  @IsOptional()
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly personalEmail: string;

  @IsOptional()
  @MaxLength(20, minLengthValidationOptions())
  readonly phone: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly roles: any;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  @MinLength(5, minLengthValidationOptions())
  @MaxLength(100, maxLengthValidationOptions())
  readonly username: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly allergies: string;
}
