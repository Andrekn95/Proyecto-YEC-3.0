import { IsNotEmpty } from 'class-validator';

export class SecurityQuestionDto {
  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  question: string;
}
