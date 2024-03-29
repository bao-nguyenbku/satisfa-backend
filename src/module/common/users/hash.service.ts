import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string) {
    const saltOrRounds = this.configService.get('bcryptSaltRounds');
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
