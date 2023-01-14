import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration]
  }), AuthModule, UsersModule, JwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
