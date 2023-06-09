import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '~/module/common/auth/auth.interface';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        ignoreNotBefore: false,
      },
      secretOrKey: configService.get<string>('accessJwtSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    return { ...payload };
  }
}
