import { Global, Module } from '@nestjs/common';
import { CatalogueModule } from '@modules/common/catalogue/catalogue.module';
import { FileModule } from '@modules/common/file/file.module';
import { MailModule } from '@modules/common/mail/mail.module';
import { coreProviders } from '@modules/core/core.provider';
import { SharedCoreModule } from '@modules/core/shared-core/shared-core.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { controllers } from '@modules/core/roles/student/controllers';

@Global()
@Module({
  imports: [CatalogueModule, FileModule, MailModule, SharedCoreModule, ReportsModule],
  controllers,
  providers: [...coreProviders],
  exports: [],
})
export class StudentModule {}
