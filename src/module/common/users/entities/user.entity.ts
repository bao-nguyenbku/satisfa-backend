import { ApiProperty } from '@nestjs/swagger';

export class UserDataEntity {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  fullname: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  email: string;
}
