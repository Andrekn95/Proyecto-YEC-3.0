import { IsUUID } from 'class-validator';
import { BaseCatalogueDto } from '@modules/common/catalogue/dto/base-catalogue.dto';

export class SeedCatalogueParentDto extends BaseCatalogueDto {
  @IsUUID()
  readonly parentId: string;
}
