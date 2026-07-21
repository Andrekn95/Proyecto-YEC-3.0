import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { isEmailValidationOptions, isNotEmptyValidationOptions } from '@utils/dto-validation';
import { SecurityQuestionDto } from '@auth/dto/security-questions/security-question.dto';

export class EmailResetSecurityQuestionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecurityQuestionDto)
  @IsNotEmpty(isNotEmptyValidationOptions())
  securityQuestions: SecurityQuestionDto[];

  @IsEmail({}, isEmailValidationOptions())
  email: string;
}
