import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserEntity } from '~/module/common/users/entities/user.entity';
import { OrderStatus, OrderType, PaymentStatus } from '../order.schema';
import { ReservationEntity } from '~/module/private/reservations/entities/reservation.entity';
import { ProductEntity } from '~/module/private/products/entities/product.entity';

export class OrderEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty()
  paymentStatus: PaymentStatus;

  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  customerId: UserEntity;

  @ApiProperty()
  reservationId: ReservationEntity;

  @ApiProperty()
  items: (ProductEntity & { qty: number })[];
}
