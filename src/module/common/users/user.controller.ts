import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/module/common/auth/guards/access-auth.guard';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '~/constants/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch()
  async updateUserById(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePasswordById(
    @Request() req,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(req.user.id, updatePassword);
  }
}
