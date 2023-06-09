import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDataDto extends OmitType(UserEntity, [
  'password',
  'refreshToken',
] as const) {}
