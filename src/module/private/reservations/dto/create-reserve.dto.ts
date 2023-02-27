import { OmitType } from '@nestjs/swagger';
import { ReservationEntity } from '../entities/reservation.entity';

export class CreateReservationDto extends OmitType(ReservationEntity, ['id']) {}
