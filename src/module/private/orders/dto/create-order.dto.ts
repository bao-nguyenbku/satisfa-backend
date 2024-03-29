import { OmitType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto extends OmitType(OrderEntity, [
  'id',
  'reservationId',
  'customerId',
]) {
  @IsString()
  @IsOptional()
  reservationId: string;
}
