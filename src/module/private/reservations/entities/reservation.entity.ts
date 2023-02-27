import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
export class ReservationEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  table: number;

  @ApiProperty()
  numberOfGuest: number;

  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;
}
