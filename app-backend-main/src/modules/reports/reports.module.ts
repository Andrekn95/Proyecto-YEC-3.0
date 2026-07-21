import { Global, Module } from '@nestjs/common';
import { PdfModule } from '@modules/reports/pdf/pdf.module';

@Global()
@Module({
  imports: [PdfModule],
  exports: [PdfModule],
})
export class ReportsModule {}
