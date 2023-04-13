import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { UsersModule } from '~/module/common/users/user.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ConfigModule, OrdersModule, UsersModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
