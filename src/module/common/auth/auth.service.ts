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
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';

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

  async signinWithGoogle(
    googleUser: CreateGoogleUserDto,
  ): Promise<{ accessToken: string }> {
    try {
      const existedEmail = await this.usersService.findByEmail(
        googleUser.email,
      );
      if (existedEmail) {
        return this.login({
          id: existedEmail.id,
          email: existedEmail.email,
          role: existedEmail.role,
        });
      }
      const createdUser = await this.usersService.create({
        ...googleUser,
        password: '',
        role: Role.USER,
      });
      if (createdUser) {
        return this.login({
          id: createdUser.id,
          email: createdUser.email,
          role: Role.USER,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async adminLogin(user: any) {
    if (user && user.role === Role.ADMIN) {
      return {
        accessToken: this.generateAccessToken(user),
      };
    }
  }
  generateAccessToken(data: any) {
    const payload: JwtPayload = {
      email: data.email || '',
      id: data._id || data.id || '',
      role: data.role || Role.USER,
    };
    return this.jwtService.sign(payload);
  }
  async login(user: any): Promise<{ accessToken: string }> {
    return {
      accessToken: this.generateAccessToken(user),
    };
  }
}
