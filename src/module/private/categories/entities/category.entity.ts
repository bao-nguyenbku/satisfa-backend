import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: string;
}
