import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '~/module/common/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '~/module/common/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { HashService } from '~/module/common/users/hash.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      // imports: [ConfigModule],
      // useFactory: async (configServie: ConfigService) => ({}),
      // inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    HashService,
    ConfigService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
