import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '~/module/common/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from '~/module/common/users/dto/signin-user';
import { HashService } from '~/module/common/users/hash.service';
import { JwtPayload } from './auth.interface';
import { User } from '../users/user.schema';
import { Role } from '~/constants/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(user: SigninUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = user;
    const existedUser = await this.usersService.findByEmail(email);
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
  async adminLogin(user: any) {
    if (user && user.role === Role.ADMIN) {
      const payload: JwtPayload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
  }
  async login(user: any) {
    const payload: JwtPayload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
