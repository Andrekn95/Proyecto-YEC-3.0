import { RoleDto } from './role.dto';
import { PickType } from '@nestjs/swagger';

export class ReadRoleDto extends PickType(RoleDto, ['code', 'name']) {}
