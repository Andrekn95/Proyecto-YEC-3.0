import { Global, Module } from '@nestjs/common';
import { InternalPdfController } from '@modules/reports/pdf/internal-pdf.controller';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';
import { InternalPdfSql } from '@modules/reports/pdf/internal-pdf.sql';
import { PrinterService } from '@modules/reports/pdf/printer.service';
import { coreProviders } from '@modules/core/core.provider';

@Global()
@Module({
  imports: [],
  controllers: [InternalPdfController],
  providers: [...coreProviders, InternalPdfService, InternalPdfSql, PrinterService],
  exports: [InternalPdfService],
})
export class PdfModule {}
