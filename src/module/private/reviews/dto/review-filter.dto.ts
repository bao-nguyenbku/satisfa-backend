import { IsNumberString, IsOptional } from 'class-validator';
export class ReviewFilter {
  @IsNumberString()
  @IsOptional()
  limit: number;
}
