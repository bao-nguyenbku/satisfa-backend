import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AppController } from './app.controller';
import { GatewayModule } from './gateway/gateway.module';
import { SatisgiModule } from './satisgi/satisgi.module';
import { ProductModule } from './product/product.module';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { TableModule } from './table/table.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
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
    ReservationModule
  ],
  controllers: [
    AuthController,
    AppController,
    UploadController,
    CategoryController,
  ],
})
export class AppModule {}
