import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { UsersModule } from '~/module/common/users/user.module';
import { OrdersModule } from '../orders/orders.module';
import { ReservationModule } from '../reservations/reservation.module';
import { PaymentModule } from '../payment/payment.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    ConfigModule,
    OrdersModule,
    UsersModule,
    ReservationModule,
    PaymentModule,
    ReviewsModule,
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
