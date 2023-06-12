import { PickType } from '@nestjs/swagger';
import { ReservationEntity } from '../entities/reservation.entity';
import { ReservationStatus } from '../reservation.schema';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class CreateReservationDto extends PickType(ReservationEntity, [
  'numberOfGuests',
  'date',
  'note',
]) {
  customerId: string;
  tableId: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsBoolean()
  @IsOptional()
  isRemind: boolean;
}
