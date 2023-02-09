import { Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categorys')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getAllCategory() {
    return this.categoryService.findAll();
  }
}
