import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  fullname: string;

  @IsString()
  password: string;
}
