import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TableStatus } from '../table.schema';

export class TableEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  code: string;

  @ApiProperty()
  numberOfSeats: number;

  @ApiProperty()
  status: TableStatus;
}
