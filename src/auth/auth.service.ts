import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
// import { CreateUserDto } from './dto/create-user';
import { SigninUserDto } from '../users/dto/signin-user';
import { HashService } from '~/users/hash.service';
import { JwtPayload } from './auth.interface';
import { User } from '~/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(user: SigninUserDto): Promise<any> {
    const { username, password } = user;
    const existedUser = await this.usersService.findByUsername(username);
    if (!existedUser) {
      throw new NotAcceptableException('Could not find this user');
    }
    const isPasswordMatched = await this.hashService.comparePassword(
      password,
      existedUser.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const result = { ...existedUser };
    delete result.password;
    return result;
  }
  async login(user: any) {
    const payload: JwtPayload = {
      username: user.username,
      id: user._id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
