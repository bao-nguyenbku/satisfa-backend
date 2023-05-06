import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';

export class TableEntity {
  @ApiProperty()
  @IsString()
  id: string;

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
