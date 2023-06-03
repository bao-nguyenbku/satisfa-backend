import { IsEmail, IsString } from 'class-validator';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

export class RemindReservationDto {
  @IsEmail()
  to: string;
  @IsString()
  subject?: string;

  content: ReservationEntity;
}
