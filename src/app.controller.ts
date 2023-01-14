import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Post } from '@nestjs/common/decorators';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async authMe(@Request() req) {
   return req.user; 
  }
}
