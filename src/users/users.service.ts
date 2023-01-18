import { Injectable } from '@nestjs/common';

export type User = any;
@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'baonguyen',
      fullname: 'Bảo Nguyễn',
      password: '12345678',
    },
    {
      id: 2,
      username: 'maria',
      fullname: 'John Maria',
      password: 'guess',
    },
  ];
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
