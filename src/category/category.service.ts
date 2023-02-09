import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  async findAll() {
    return [1, 2, 3, 4];
  }
}
