import { PickType } from '@nestjs/swagger';
import { ReservationEntity } from '../entities/reservation.entity';

export class CreateReservationDto extends PickType(ReservationEntity, [
  'numberOfGuest',
  'from',
  'to',
]) {
  customerId: string;
  tableId: string;
}
