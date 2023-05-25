import {
  IsBooleanString,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReservationFilter {
  @IsISO8601()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsBooleanString()
  @IsOptional()
  currentUser?: boolean;

  @IsBooleanString()
  @IsOptional()
  currentDate?: boolean;

  @IsBooleanString()
  @IsOptional()
  checkedIn?: boolean;
}
