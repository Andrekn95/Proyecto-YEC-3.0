import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@utils/pagination';

export class FilterRoleDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly code: string;

  @IsOptional()
  @IsString()
  readonly name: string;
}
