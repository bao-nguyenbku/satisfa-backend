import { UserEntity } from '~/module/common/users/entities/user.entity';
import {
  IsString,
  IsNumber,
  MaxLength,
  IsISO8601,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewEntity {
  @IsString()
  id: string;

  @Type(() => UserEntity)
  customerId: UserEntity;

  @IsString()
  @MaxLength(1000, {
    message: 'length of paragraph must be lower than 1000 letters',
  })
  review: string;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: 'point must be an integer number',
    },
  )
  @IsOptional()
  foodRating: number;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    {
      message: 'point must be an integer number',
    },
  )
  @IsOptional()
  serviceRating: number;

  @IsString()
  @IsISO8601()
  createdAt: string;

  @IsString()
  @IsISO8601()
  updatedAt: string;

  @IsOptional()
  @IsBoolean()
  visible: boolean;
}
