import { Module } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
  providers: [PaymentService],
})
export class PaymentModule {}
