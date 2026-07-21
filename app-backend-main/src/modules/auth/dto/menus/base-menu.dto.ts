import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import {
  isBooleanValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
} from '@utils/dto-validation';
import { MenuTypeEnum } from '@auth/enums';
import { MenuEntity } from '@auth/entities';

export class BaseMenuDto {
  @IsOptional()
  readonly parent: MenuEntity;

  @IsOptional()
  readonly children: MenuEntity[];

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly icon: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsBoolean(isBooleanValidationOptions())
  readonly isVisible: boolean;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly label: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly routerLink: string;

  @IsNumber()
  readonly sort: number;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly type: MenuTypeEnum;
}
