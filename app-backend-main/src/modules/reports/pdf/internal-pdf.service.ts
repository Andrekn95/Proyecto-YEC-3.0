import { Inject, Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigType } from '@nestjs/config';
import { envConfig } from '@config';
import { InternalPdfSql } from '@modules/reports/pdf/internal-pdf.sql';
import { registerCertificateReport } from '@modules/reports/pdf/templates/internals/register-certificate.report';

@Injectable()
export class InternalPdfService {
  constructor(
    private readonly internalPdfSql: InternalPdfSql,
    private readonly printerService: PrinterService,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
  ) {}

  async generateUsersReportBuffer() {
    const data: any = await this.internalPdfSql.findUsers();
    try {
      return await this.printerService.createPdfBuffer(registerCertificateReport(data));
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
