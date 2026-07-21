import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@utils/pagination';

export class FilterDpaDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly code: string;

  @IsOptional()
  @IsString()
  readonly name: string;
}
