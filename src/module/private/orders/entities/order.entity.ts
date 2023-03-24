import { UserEntity } from '~/module/common/users/entities/user.entity';
import { OrderStatus, PaymentStatus } from '../order.schema';
import { ReservationEntity } from '../../reservations/entities/reservation.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrderEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalCost: number;

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
