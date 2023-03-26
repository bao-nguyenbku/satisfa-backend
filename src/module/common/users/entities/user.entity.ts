import { ApiProperty } from '@nestjs/swagger';
// import mongoose from 'mongoose';
import { Role } from '~/constants/role.enum';

export class UserEntity {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: Role;
}
