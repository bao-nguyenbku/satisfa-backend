import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductEntity {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @Type(() => String)
  images: string[];

  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  visible: boolean;
}
