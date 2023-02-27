import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reservation,
  ReservationSchema,
} from '~/module/private/reservations/reservation.schema';
import { ReservationController } from './reservation.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
