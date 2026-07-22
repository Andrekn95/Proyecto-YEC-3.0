import { PickType } from '@nestjs/swagger';
import { TeacherDistributionDto } from './teacher-distribution.dto';

export class UpdateTeacherDistributionDto extends PickType(TeacherDistributionDto, [
  'capacity',
  'parallelId',
  'workdayId',
  'subjectId',
  'schoolPeriodId',
  'classroomId',
]) {}
