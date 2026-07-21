import { IsBoolean } from 'class-validator';
import { isBooleanValidationOptions } from '@utils/dto-validation';
import { BaseCatalogueDto } from '@modules/common/catalogue/dto/base-catalogue.dto';

export class SeedCatalogueDto extends BaseCatalogueDto {
  @IsBoolean(isBooleanValidationOptions())
  readonly required: boolean;
}
