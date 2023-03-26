import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '~/config/configuration';
import { AuthModule } from '~/module/common/auth/auth.module';
import { UsersModule } from '~/module/common/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TableModule } from '~/module/private/tables/table.module';
import { ReservationModule } from '~/module/private/reservations/reservation.module';
import { GatewayModule } from '~/gateway/gateway.module';
import { SatisgiModule } from '~/module/private/satisgi/satisgi.module';
import { ProductModule } from '~/module/private/products/product.module';
import { UploadModule } from '~/module/private/uploads/upload.module';
import { CategoryModule } from '~/module/private/categories/category.module';
import { OrdersModule } from './module/private/orders/orders.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    JwtModule,
    AuthModule,
    UsersModule,
    GatewayModule,
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    SatisgiModule,
    ProductModule,
    UploadModule,
    TableModule,
    CategoryModule,
    ReservationModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
