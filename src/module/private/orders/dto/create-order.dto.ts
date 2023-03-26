import { OmitType } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';

export class CreateOrderDto extends OmitType(OrderEntity, ['id']) {}
