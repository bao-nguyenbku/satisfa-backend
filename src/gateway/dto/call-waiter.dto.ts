import { ReservationEntity } from '~/module/private/reservations/entities/reservation.entity';

export class CallWaiterDto {
  userId: string;
  reservations: ReservationEntity;
}
