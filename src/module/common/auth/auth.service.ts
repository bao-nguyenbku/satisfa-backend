import {
  BadRequestException,
  ForbiddenException,
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
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
    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }
    const tokens = await this.generateTokens(user);
    const updatedResult = await this.updateRefeshToken(
      user.id,
      tokens.refreshToken,
    );
    if (!updatedResult) {
      throw new BadRequestException('User is not existed');
    }
    return tokens;
  }
  async generateTokens(data: JwtPayload) {
    const payload: JwtPayload = {
      email: data.email || '',
      id: data.id || '',
      role: data.role || Role.USER,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('accessJwtSecret'),
        expiresIn: this.configService.get<string>('accessJwtExpireIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('refreshJwtSecret'),
        expiresIn: this.configService.get<string>('refreshJwtExpireIn'),
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }
    // TODO: validate refreshToken params;
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await this.updateRefeshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  async login(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokens(user);
    const updatedResult = await this.updateRefeshToken(
      user.id,
      tokens.refreshToken,
    );
    if (!updatedResult) {
      throw new BadRequestException('User is not existed');
    }
    return tokens;
  }
  async updateRefeshToken(userId: string, refreshToken: string) {
    return this.usersService.update(userId, {
      refreshToken,
    });
  }
  async validateUserById(id: string) {
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
