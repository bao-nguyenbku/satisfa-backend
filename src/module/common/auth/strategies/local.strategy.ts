import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '~/module/common/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const existedUser = await this.authService.validateUser({
      email,
      password,
    });
    if (!existedUser) {
      throw new UnauthorizedException('This user is not existed');
    }
    return existedUser;
  }
}
