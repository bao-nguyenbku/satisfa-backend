import { OmitType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { IsString } from 'class-validator';

export class CreateOrderDto extends OmitType(OrderEntity, [
  'id',
  'reservationId',
]) {
  @IsString()
  reservationId?: string;
}
