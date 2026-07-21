import { BaseMenuDto } from '@auth/dto';
import { PickType } from '@nestjs/swagger';

export class ReadMenuDto extends PickType(BaseMenuDto, [
  'icon',
  'isVisible',
  'label',
  'routerLink',
  'type',
]) {}
