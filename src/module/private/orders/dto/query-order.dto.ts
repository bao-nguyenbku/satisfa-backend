import { OrderStatus } from '../order.schema';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class OrderFilterDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  currentUser?: string;
}
