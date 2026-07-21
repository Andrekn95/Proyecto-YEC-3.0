import { PickType } from '@nestjs/swagger';
import { UserDto } from '@auth/dto';

export class UpdateAdditionalInformationDto extends PickType(UserDto, [
  'bloodType',
  'ethnicOrigin',
  'identificationType',
  'gender',
  'maritalStatus',
  'sex',
  'nationality',
  'allergies',
]) {}
