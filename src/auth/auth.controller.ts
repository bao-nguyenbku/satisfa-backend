import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user';
import { UsersService } from '../users/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async whoAmI(@Request() req) {
    const { email } = req.user;
    const user = await this.userService.findByEmail(email);
    if (user) {
      return {
        email: user.email,
        fullname: user.fullname,
      };
    }
  }
}
