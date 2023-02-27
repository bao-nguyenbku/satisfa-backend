import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '~/config/configuration';
import { AuthModule } from '~/module/common/auth/auth.module';
import { UsersModule } from '~/module/common/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TableModule } from './table/table.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthController } from '~/module/common/auth/auth.controller';
import { AppController } from '~/app.controller';
import { GatewayModule } from '~/gateway/gateway.module';
import { SatisgiModule } from '~/module/private/satisgi/satisgi.module';
import { ProductModule } from '~/module/private/products/product.module';
import { UploadController } from '~/module/private/uploads/upload.controller';
import { UploadModule } from '~/module/private/uploads/upload.module';
import { CategoryController } from '~/module/private/categories/category.controller';
import { CategoryModule } from '~/module/private/categories/category.module';

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
    ReservationModule,
  ],
  controllers: [
    AuthController,
    AppController,
    UploadController,
    CategoryController,
  ],
})
export class AppModule {}
