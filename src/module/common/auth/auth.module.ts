import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '~/module/common/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '~/module/common/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '~/module/common/auth/strategies/jwt.strategy';
import { HashService } from '~/module/common/users/hash.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configServie: ConfigService) => ({
        secret: configServie.get('jwtSecret'),
        signOptions: {
          expiresIn: configServie.get('jwtExpireIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    HashService,
    ConfigService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
