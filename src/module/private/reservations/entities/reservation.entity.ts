import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
export class ReservationEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  tableid: number;

  @ApiProperty()
  numberOfGuest: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  note: string;
}
