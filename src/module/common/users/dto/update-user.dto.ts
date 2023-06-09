import { IsString, IsOptional } from 'class-validator';
import { UpdateRefreshTokenDto } from './update-refresh-token.dto';

export class UpdateUserDto extends UpdateRefreshTokenDto {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
