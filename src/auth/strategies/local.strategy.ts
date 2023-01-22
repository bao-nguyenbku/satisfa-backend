import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { SigninUserDto } from '~/users/dto/signin-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const existedUser = await this.authService.validateUser({
      username,
      password,
    });
    if (!existedUser) {
      throw new UnauthorizedException();
    }
    return existedUser;
  }
}
