import { PartialType } from '@nestjs/swagger';
import { CreateCatalogueDto } from './create-catalogue.dto';

export class UpdateCatalogueDto extends PartialType(CreateCatalogueDto) {}
