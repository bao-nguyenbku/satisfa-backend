import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    //TODO: Just a sample check
    const isValidPassword = user && user.password === password;
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    if (!user) {
      throw new NotAcceptableException('Could not find this user');
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id
    }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
