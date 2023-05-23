import { OrderStatus } from '../order.schema';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';

export class OrderFilterDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsBooleanString()
  @IsOptional()
  currentUser?: boolean;

  @IsBooleanString()
  @IsOptional()
  currentDate?: boolean;
}
