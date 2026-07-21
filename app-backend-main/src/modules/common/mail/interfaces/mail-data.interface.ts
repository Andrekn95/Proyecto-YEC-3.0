import { AttachmentInterface } from './attachment.interface';

export interface MailDataInterface {
  to: string | string[];
  subject: string;
  template: string;
  data: any;
  // attachment?: AttachmentInterface;
  attachments?: AttachmentInterface[];
}
