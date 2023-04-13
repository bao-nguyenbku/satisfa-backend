import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { UserEntity } from '~/module/common/users/entities/user.entity';
import {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '~/module/private/orders/order.schema';
import { ReservationEntity } from '~/module/private/reservations/entities/reservation.entity';
import { ProductEntity } from '~/module/private/products/entities/product.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { TakeawayCustomer } from '~/module/private/orders/order.schema';
import { Type } from 'class-transformer';

export class OrderEntity {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  totalCost: number;

  @ApiProperty({
    default: OrderType.DINE_IN,
  })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    default: PaymentStatus.UNPAID,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @IsOptional()
  payment: PaymentEntity;

  @ApiProperty({
    default: OrderStatus.NEW,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  customerId: UserEntity;

  @ApiProperty()
  @IsOptional()
  @Type(() => TakeawayCustomer)
  tempCustomer: TakeawayCustomer;

  @ApiProperty()
  @IsOptional()
  reservationId: ReservationEntity;

  @ApiProperty()
  items: (ProductEntity & { qty: number })[];
}
