import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @UseFilters(MongoExceptionFilter)
  async getAllCategory() {
    return this.categoryService.findAll();
  }

  @Post('/create')
  @UseFilters(MongoExceptionFilter)
  async createCategory(
    @Body() createCategoryData: CreateCategoryDto[] | CreateCategoryDto,
  ) {
    if (Array.isArray(createCategoryData)) {
      return this.categoryService.createMany(createCategoryData);
    }
    return this.categoryService.create(createCategoryData);
  }
}
