import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
// import { CreateUserDto } from './dto/create-user';
import { SigninUserDto } from '../users/dto/signin-user';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user: SigninUserDto): Promise<any> {
    const { username, password } = user;
    const existedUser = await this.usersService.findByUsername(username);

    //TODO: Just a sample check
    const isValidPassword = existedUser && existedUser.password === password;
    if (existedUser && isValidPassword) {
      const { password, ...result } = existedUser;
      return result;
    }
    if (!existedUser) {
      throw new NotAcceptableException('Could not find this user');
    }
    return null;
  }
  async login(user: SigninUserDto) {
    const payload = {
      username: user.username,
    }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
  // async register(createUser: CreateUserDto) {

  // }
}
