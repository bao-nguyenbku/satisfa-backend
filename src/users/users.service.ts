import { Injectable } from '@nestjs/common';

export type User = any;
@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      username: 'Bao Nguyen',
      password: '12345678',
    },
    {
      id: 2,
      username: 'maria',
      password: 'guess',
    },
  ];
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
