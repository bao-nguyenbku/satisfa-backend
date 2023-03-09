import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
export class TableEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  code: string;

  @ApiProperty()
  seatOfNumber: number;

  @ApiProperty()
  status: string;
}
