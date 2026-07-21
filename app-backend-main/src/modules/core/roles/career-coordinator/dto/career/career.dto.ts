import { IsOptional } from 'class-validator';

export class CareerDto {
  @IsOptional()
  readonly code: string;

  @IsOptional()
  readonly resolutionNumber: string;

  @IsOptional()
  readonly shortName: string;

  @IsOptional()
  readonly institutionId: string;
}
