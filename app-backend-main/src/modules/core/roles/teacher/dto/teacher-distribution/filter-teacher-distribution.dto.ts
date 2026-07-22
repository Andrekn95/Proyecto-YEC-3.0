import { PickType } from '@nestjs/swagger';
import { PaginationDto } from '@utils/pagination';
import { IsOptional } from 'class-validator';

export class FilterTeacherDistributionDto extends PickType(PaginationDto, ['page', 'limit', 'order', 'search', 'sort']) {
  @IsOptional() careerId: string;
  @IsOptional() schoolPeriodId: string;
  @IsOptional() subjectId: string;
  @IsOptional() parallelId: string;
  @IsOptional() workdayId: string;
}
