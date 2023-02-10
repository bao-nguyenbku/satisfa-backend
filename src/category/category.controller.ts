import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getAllCategory() {
    return this.categoryService.findAll();
  }

  @Post('/create')
  async createCategory(
    @Body() createCategoryData: CreateCategoryDto[] | CreateCategoryDto,
  ) {
    if (Array.isArray(createCategoryData)) {
      return this.categoryService.createMany(createCategoryData);
    }
    return this.categoryService.create(createCategoryData);
  }
}
