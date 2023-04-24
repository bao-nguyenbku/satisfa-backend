import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { ConfigModule } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {
  Reservation,
  ReservationSchema,
} from '../reservations/reservation.schema';
import { Table, TableSchema } from '../tables/table.schema';
import { Payment, PaymentSchema } from '../payment/payment.schema';
import { UsersModule } from '~/module/common/users/user.module';
import { TableModule } from '../tables/table.module';
import { ReservationModule } from '../reservations/reservation.module';
import { ReservationService } from '../reservations/reservation.service';
import { TableService } from '../tables/table.service';
import { PaymentModule } from '../payment/payment.module';
import { PaymentService } from '../payment/payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: Table.name,
        schema: TableSchema,
      },
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    ConfigModule,
    UsersModule,
    TableModule,
    ReservationModule,
    PaymentModule,
  ],
  exports: [OrdersService, MongooseModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ReservationService,
    TableService,
    PaymentService,
    // UsersService,
    // HashService,
  ],
})
export class OrdersModule {}
