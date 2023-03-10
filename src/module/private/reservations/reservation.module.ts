import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reservation,
  ReservationSchema,
} from '~/module/private/reservations/reservation.schema';
import { ReservationController } from './reservation.controller';
import { ConfigModule } from '@nestjs/config';
import { Table, TableSchema } from '../tables/table.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
