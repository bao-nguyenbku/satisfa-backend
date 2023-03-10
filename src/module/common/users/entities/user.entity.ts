import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Role } from '~/constants/role.enum';

export class UserDataEntity {
  @ApiProperty({ required: true })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: Role;
}
