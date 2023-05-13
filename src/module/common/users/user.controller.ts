import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '~/constants/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUser() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUserById(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
