import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
export class ProductEntity {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  images: Array<string>;

  @ApiProperty()
  visible: boolean;
}
