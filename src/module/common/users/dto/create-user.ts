import { OmitType } from '@nestjs/swagger';
import { UserDataEntity } from '../entities/user.entity';

export class CreateUserDto extends OmitType(UserDataEntity, ['_id']) {}
