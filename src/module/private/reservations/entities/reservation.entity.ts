import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TableEntity } from '../../tables/entities/table.entity';
import { UserDataDto } from '~/module/common/users/dto/response-user';

export class ReservationEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  owner: UserDataDto;

  @ApiProperty()
  table: TableEntity;

  @ApiProperty()
  numberOfGuests: number;

  @ApiProperty()
  date: string;
}
