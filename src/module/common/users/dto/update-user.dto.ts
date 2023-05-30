import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  phone: string;
}
