import { OmitType } from '@nestjs/swagger';
import { UserDataEntity } from '../entities/user.entity';

export class UserDataDto extends OmitType(UserDataEntity, [
  'password',
  'email',
] as const) {}
