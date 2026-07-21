import { PickType } from '@nestjs/swagger';
import { CareerDto } from '@modules/core/roles/career-coordinator/dto/career/career.dto';

export class UpdateCareerDto extends PickType(CareerDto, [
  'code',
  'resolutionNumber',
  'shortName',
  'institutionId',
]) {}
