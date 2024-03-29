import { OrderStatus } from '../order.schema';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';

export class OrderFilterDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsBooleanString()
  @IsOptional()
  currentUser?: boolean;

  @IsOptional()
  @IsBooleanString()
  lastest?: boolean;

  @IsBooleanString()
  @IsOptional()
  currentDate?: boolean;
}
