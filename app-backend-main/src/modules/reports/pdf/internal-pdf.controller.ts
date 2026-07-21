import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Internal PDF Reports')
@Controller('reports/pdf/internals')
export class InternalPdfController {
  constructor(private readonly internalPdfService: InternalPdfService) {}

  @PublicRoute()
  @Get('users')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=users-report.pdf') // o "attachment;"
  async generateUsersReportBuffer() {
    return await this.internalPdfService.generateUsersReportBuffer();
  }
}
