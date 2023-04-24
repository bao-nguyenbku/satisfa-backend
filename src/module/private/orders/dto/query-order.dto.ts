import { OrderStatus } from '../order.schema';
import { IsEnum, IsOptional } from 'class-validator';

export class OrderFilterDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;
}
