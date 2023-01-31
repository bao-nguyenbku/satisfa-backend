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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    JwtModule,
    GatewayModule,
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    SatisgiModule,
  ],
  controllers: [AuthController, AppController],
})
export class AppModule {}
