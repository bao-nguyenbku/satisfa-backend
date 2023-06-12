import {
  IsBooleanString,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReservationStatus } from '../reservation.schema';

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

  @IsBooleanString()
  @IsOptional()
  fromNow?: boolean;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
}
