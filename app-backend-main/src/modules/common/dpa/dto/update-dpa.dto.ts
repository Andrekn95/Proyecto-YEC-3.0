import { PartialType } from '@nestjs/swagger';
import { CreateDpaDto } from './create-dpa.dto';

export class UpdateDpaDto extends PartialType(CreateDpaDto) {}
