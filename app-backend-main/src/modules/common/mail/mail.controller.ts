import { Body, Controller, Post, Query } from '@nestjs/common';
import { ResponseHttpInterface } from '@utils/interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from '@modules/common/mail/mail.service';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { MailTemplateEnum } from '@utils/enums';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Mails')
@Controller('common/mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send Test Email' })
  @PublicRoute()
  @Post('test')
  async test(@Body() payload: any): Promise<ResponseHttpInterface> {
    const mailData: MailDataInterface = {
      to: payload.to,
      subject: 'Testing Email Send',
      template: MailTemplateEnum.TESTING,
      data: {
        test: payload.message,
      },
    };

    await this.mailService.sendMail(mailData);

    return {
      data: payload.to,
      message: 'Correo enviado correctamente',
      title: 'Enviado',
    };
  }

  @ApiOperation({ summary: 'Send Test Email' })
  @PublicRoute()
  @Post('test/attachments')
  async testAttachments(@Body() payload: any, @Query() q: any): Promise<ResponseHttpInterface> {
    const mailData: MailDataInterface = {
      to: payload.to,
      subject: 'Testing Email Send',
      template: MailTemplateEnum.TESTING,
      data: {
        test: payload.message,
      },
    };

    await this.mailService.sendMail(mailData);

    return {
      data: payload.to,
      message: 'Correo enviado correctamente',
      title: 'Enviado',
    };
  }
}
