import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Reservation,
  ReservationSchema,
} from '~/module/private/reservations/reservation.schema';
import { ReservationController } from './reservation.controller';
import { ConfigModule } from '@nestjs/config';
import { TableService } from '../tables/table.service';
import { Table, TableSchema } from '../tables/table.schema';
import { User, UserSchema } from '~/module/common/users/user.schema';
import { UsersService } from '~/module/common/users/user.service';
import { HashService } from '~/module/common/users/hash.service';
import { TableModule } from '../tables/table.module';
import { UsersModule } from '~/module/common/users/user.module';

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
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    TableModule,
    UsersModule,
  ],
  exports: [ReservationService],
  providers: [ReservationService, TableService],
  controllers: [ReservationController],
})
export class ReservationModule {}
