import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

export class TableEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  numberOfSeats: number;

  @ApiProperty()
  @Type(() => ReservationEntity)
  reservations: ReservationEntity[];
}
