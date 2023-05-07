import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './reviews.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema,
      },
    ]),
    OrdersModule,
  ],
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
