import { ApiProperty } from '@nestjs/swagger';
import { TableEntity } from '../../tables/entities/table.entity';
import { UserEntity } from '~/module/common/users/entities/user.entity';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReservationStatus } from '../reservation.schema';
import { Type } from 'class-transformer';

export class ReservationEntity {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserEntity)
  customerId: UserEntity;

  @ApiProperty()
  @ValidateNested()
  @Type(() => TableEntity)
  tableId: TableEntity;

  @ApiProperty()
  @IsNumber()
  numberOfGuests: number;

  @ApiProperty()
  @IsISO8601()
  date: string;

  @ApiProperty()
  note: string;

  @ApiProperty()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @IsBoolean()
  @IsOptional()
  isRemind: boolean;
}
