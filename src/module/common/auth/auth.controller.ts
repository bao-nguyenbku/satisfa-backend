import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/access-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import { CreateUserDto } from '~/module/common/users/dto/create-user.dto';
import { UsersService } from '~/module/common/users/user.service';
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';
import { Request as ExpressReq } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() req: ExpressReq) {
    return this.authService.refreshToken(
      req.user['id'],
      req.user['refreshToken'],
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('admin/login')
  @UseGuards(LocalAuthGuard)
  async adminLogin(@Request() req) {
    return this.authService.adminLogin(req.user);
  }
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Post('google')
  async signinWithGoogle(@Body() googleUser: CreateGoogleUserDto) {
    return this.authService.signinWithGoogle(googleUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async whoAmI(@Request() req) {
    const { id } = req.user;

    const user = await this.authService.validateUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar,
    };
  }
}
