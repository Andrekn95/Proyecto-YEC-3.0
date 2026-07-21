import { Global, Module } from '@nestjs/common';
import { FolderPathsService } from '@modules/common/folder-paths.service';
import { MailService } from './mail.service';
import { MailController } from '@modules/common/mail/mail.controller';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from '@modules/common/mail/mail.processor';
import { mailProviders } from '@modules/common/mail/mail.providers';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [MailController],
  providers: [...mailProviders, MailService, FolderPathsService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
