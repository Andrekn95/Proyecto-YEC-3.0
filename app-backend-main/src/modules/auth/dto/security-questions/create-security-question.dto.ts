import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { isNotEmptyValidationOptions } from '@utils/dto-validation';
import { SecurityQuestionDto } from '@auth/dto/security-questions/security-question.dto';

export class CreateSecurityQuestionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecurityQuestionDto)
  @IsNotEmpty(isNotEmptyValidationOptions())
  securityQuestions: SecurityQuestionDto[];
}
