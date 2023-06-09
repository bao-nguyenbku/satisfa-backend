import { PickType } from '@nestjs/swagger';
import { ReservationEntity } from '../entities/reservation.entity';

export class CreateReservationDto extends PickType(ReservationEntity, [
  'numberOfGuests',
  'date',
  'note',
  'status',
]) {
  customerId: string;
  tableId: string;
}
