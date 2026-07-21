import { IsIn, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import {
  isInValidationOptions,
  isPositiveValidationOptions,
  isStringValidationOptions,
  minLengthValidationOptions,
} from '../dto-validation';
import { Type } from 'class-transformer';

const orderableFields = ['ASC', 'DESC'] as const;

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  limit: number;

  @Type(() => Number)
  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  page: number;

  @IsOptional()
  @IsString(isStringValidationOptions())
  search: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  @MinLength(1, minLengthValidationOptions())
  sort: string;

  @IsOptional()
  @IsIn(orderableFields, isInValidationOptions())
  order: 'ASC' | 'DESC';
}
