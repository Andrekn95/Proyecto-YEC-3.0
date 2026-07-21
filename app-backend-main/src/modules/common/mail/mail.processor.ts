import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '@modules/common/mail/mail.service';

@Processor('email', {
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'sendMail') {
      return this.mailService.sendRealMail(job.data);
    }
  }
}
