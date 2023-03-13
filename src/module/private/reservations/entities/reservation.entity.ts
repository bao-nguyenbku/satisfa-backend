import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TableEntity } from '../../tables/entities/table.entity';
import { UserDataDto } from '~/module/common/users/dto/response-user';

export class ReservationEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty()
  numberOfGuests: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  note: string;
}
