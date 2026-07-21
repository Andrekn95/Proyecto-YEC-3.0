import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule],
  exports: [CatalogueModule, FileModule, MailModule],
})
export class ExcelModule {}
