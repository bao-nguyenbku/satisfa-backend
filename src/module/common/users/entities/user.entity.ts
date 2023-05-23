import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
// import mongoose from 'mongoose';
import { Role } from '~/constants/role.enum';

export class UserEntity {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  fullname: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ required: true })
  @IsUrl()
  avatar: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  phone: string;
}
