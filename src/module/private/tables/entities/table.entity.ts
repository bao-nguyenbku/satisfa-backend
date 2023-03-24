import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

export class TableEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  code: string;

  @ApiProperty()
  numberOfSeats: number;

  @ApiProperty()
  reservations: ReservationEntity[];
}
