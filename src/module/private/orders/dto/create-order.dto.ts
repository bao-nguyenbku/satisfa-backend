import { OmitType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

export class CreateOrderDto extends OmitType(OrderEntity, [
  'id',
  'reservationId',
]) {
  reservationId: string;
}
