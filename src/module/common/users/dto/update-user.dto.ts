import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  fullname: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;
}
