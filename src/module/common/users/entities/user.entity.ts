import { ApiProperty } from '@nestjs/swagger';

export class UserDataEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;
}
