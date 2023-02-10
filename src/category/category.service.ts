import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '~/schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    return [1, 2, 3, 4];
  }

  async create(createData: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createData);
    return createdCategory.save();
  }
  async createMany(createDataList: CreateCategoryDto[]) {
    const createdCategories = await this.categoryModel.insertMany(
      createDataList,
    );
    return createdCategories;
  }
}
