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
import { CreateUserDto } from '~/module/common/users/dto/create-user';
import { UsersService } from '~/module/common/users/user.service';
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

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
    const user = await this.userService.findById(id);
    if (user) {
      return {
        id,
        email: user.email,
        fullname: user.fullname,
        avatar: user.avatar,
      };
    }
  }
}
