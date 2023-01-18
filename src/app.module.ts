import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration]
  }), AuthModule, UsersModule, JwtModule],
  controllers: [AuthController],
})
export class AppModule {}
