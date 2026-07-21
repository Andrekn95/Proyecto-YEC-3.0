import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import { envConfig } from '@config';
import { MailDataInterface } from './interfaces/mail-data.interface';
import { join } from 'path';
import { FolderPathsService } from '../folder-paths.service';
import { Attachment } from 'nodemailer/lib/mailer';
import { MailSendException } from '@utils/exceptions/MailSendException';
import { format } from 'date-fns';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CommonRepositoryEnum } from '@utils/enums';
import { Repository } from 'typeorm';
import { MailLogEntity } from '@modules/common/mail/mail-log.entity';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @Inject(envConfig.KEY) private configService: ConfigType<typeof envConfig>,
    private readonly folderPathsService: FolderPathsService,
    @Inject(CommonRepositoryEnum.mailLogRepository)
    private readonly mailLogRepository: Repository<MailLogEntity>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.mail.host,
      port: this.configService.mail.port,
      secure: false,
      auth: {
        user: this.configService.mail.user,
        pass: this.configService.mail.pass,
      },
    });

    // this.transporter = nodemailer.createTransport({
    //   host: this.configService.mail.host,
    //   port: this.configService.mail.port,
    //   secure: this.configService.mail.secure == 'true',
    //   auth: {
    //     user: this.configService.mail.user,
    //     pass: this.configService.mail.pass,
    //   },
    // });
  }

  async onModuleInit() {
    await this.configTemplates();
  }

  async sendMail(mailData: MailDataInterface) {
    const entity = this.mailLogRepository.create({
      to: mailData.to,
      subject: mailData.subject,
      template: mailData.template,
      data: mailData.data,
      status: 'queued',
    }) as MailLogEntity;

    const logMail = await this.mailLogRepository.save(entity);

    await this.emailQueue.add(
      'sendMail',
      {
        ...mailData,
        id: logMail.id,
      },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );
  }

  async sendRealMail(mailData: MailDataInterface) {
    const mailAttachments: Attachment[] = [];

    if (mailData?.attachments) {
      mailData.attachments.forEach((attachment) => {
        const content = Buffer.isBuffer(attachment.file)
          ? attachment.file
          : Buffer.from(attachment.file!);
        let data!: Attachment;

        if (attachment.file) {
          data = {
            content,
            filename: attachment.filename,
            contentDisposition: 'attachment',
          };

          mailAttachments.push(data);
        }

        if (attachment.path) {
          data = {
            path: join(this.folderPathsService.mailTemporaryFiles, attachment.path),
            filename: attachment.filename,
            contentDisposition: 'attachment',
          };

          mailAttachments.push(data);
        }
      });
    }

    mailAttachments.push({
      filename: 'header.png',
      path: join(this.folderPathsService.mailImages, 'header.png'),
      cid: 'header',
    });

    // mailAttachments.push({
    //       filename: 'footer.png',
    //       path: join(this.folderPathsService.mailImages, 'footer.png'),
    //       cid: 'footer',
    //     });

    const sendMailOptions = {
      to: mailData.to,
      from: `"${this.configService.mail.fromName}" <${this.configService.mail.from}>`,
      subject: `${mailData.subject} - ${this.configService.app.name}`,
      template: mailData.template,
      context: {
        system: {
          name: this.configService.app.name,
          shortName: this.configService.app.shortName,
          url: this.configService.app.frontendUrl,
        },
        expiresIn: this.configService.securityCodeExpiresIn,
        year: format(new Date(), 'yyyy'),
        data: mailData.data,
      },
      attachments: mailAttachments,
    };

    try {
      const response: SentMessageInfo = await this.transporter.sendMail(sendMailOptions);

      return {
        accepted: response.accepted,
        rejected: response.rejected,
      };
    } catch (error) {
      console.error('ERROR', error);
      if (error.responseCode === 535) {
        throw new MailSendException(
          'No se pudo enviar el correo',
          'Usuario y/o contraseña del servidor de correo no válidos',
          535,
        );
      }
      throw error;
    }
  }

  private async configTemplates() {
    let pathTemplates = join(__dirname, 'templates');

    if (this.configService.app.env !== 'production' && this.configService.app.env !== 'qa') {
      pathTemplates = this.folderPathsService.mailTemplates;
    }

    const hbs = (await import('nodemailer-express-handlebars')).default;

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: `${this.folderPathsService.mailTemplates}/layouts`,
          partialsDir: `${this.folderPathsService.mailTemplates}/partials`,
          defaultLayout: 'main',
        },
        viewPath: pathTemplates,
        extName: '.hbs',
      }),
    );
  }
}
