import { HttpException } from '@nestjs/common';

export class MailSendException extends HttpException {
  constructor(error: string = 'Error', message: string = 'Error', statusCode: number = 0) {
    super(
      {
        error,
        message,
      },
      statusCode,
    );
  }
}
