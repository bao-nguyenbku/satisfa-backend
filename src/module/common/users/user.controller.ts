import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUser() {
    return this.userService.findAll();
  }
}
