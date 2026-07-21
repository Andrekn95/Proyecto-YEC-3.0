import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { join } from 'path';

const fonts = {
  Roboto: {
    normal: join(process.cwd(), 'public/fonts/roboto/Roboto-Regular.ttf'),
    bold: join(process.cwd(), 'public/fonts/roboto/Roboto-Medium.ttf'),
    italics: join(process.cwd(), 'public/fonts/roboto/Roboto-Italic.ttf'),
    bolditalics: join(process.cwd(), 'public/fonts/roboto/Roboto-MediumItalic.ttf'),
  },
};

@Injectable()
export class PrinterService {
  private readonly printer = new PdfPrinter(fonts);

  createPdf(docDefinition: TDocumentDefinitions): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition);
  }

  async createPdfBuffer(docDefinition: TDocumentDefinitions): Promise<Buffer> {
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);

    const chunks: Uint8Array[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', (err) => reject(err));
      pdfDoc.end();
    });
  }
}
