import { IsOptional } from 'class-validator';

export class TeacherDistributionDto {
  @IsOptional() capacity: number;
  @IsOptional() parallelId: string;
  @IsOptional() workdayId: string;
  @IsOptional() subjectId: string;
  @IsOptional() schoolPeriodId: string;
  @IsOptional() teacherId: string;
  @IsOptional() hours: number;
}
