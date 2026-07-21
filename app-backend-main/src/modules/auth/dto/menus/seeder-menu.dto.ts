import { PickType } from '@nestjs/swagger';
import { BaseMenuDto } from '@auth/dto';

export class SeederMenuDto extends PickType(BaseMenuDto, [
  'code',
  'icon',
  'isVisible',
  'label',
  'sort',
  'type',
]) {}
