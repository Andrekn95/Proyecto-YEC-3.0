import { PickType } from '@nestjs/swagger';
import { TeacherDistributionDto } from './teacher-distribution.dto';

export class CreateTeacherDistributionDto extends PickType(TeacherDistributionDto, [
  'capacity',
  'parallelId',
  'workdayId',
  'subjectId',
  'schoolPeriodId',
  'hours',
]) {}
