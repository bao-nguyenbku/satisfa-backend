import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TableEntity } from '../../tables/entities/table.entity';
import { UserEntity } from '~/module/common/users/entities/user.entity';

export class ReservationEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  customerId: UserEntity;

  @ApiProperty()
  tableId: TableEntity;

  @ApiProperty()
  numberOfGuests: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  note: string;
}
