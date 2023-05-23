import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category,
  CategoryDocument,
} from '~/module/private/categories/category.schema';
import { Model } from 'mongoose';
import { CategoryResponse } from './dto/category-response.dto';
import { transformResult } from '~/utils';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    try {
      const result = await this.categoryModel.find().lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }
  async updateById(id: string, updateDataDto: UpdateCategoryDto) {
    try {
      const result = await this.categoryModel
        .findByIdAndUpdate(id, updateDataDto)
        .lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }
  async create(createData: CreateCategoryDto) {
    try {
      const createdCategory = new this.categoryModel(createData);
      const insertedData = (await createdCategory.save()).toObject();
      return transformResult(insertedData);
    } catch (error) {
      throw error;
    }
  }
  async createMany(createDataList: CreateCategoryDto[]) {
    const createdCategories = await this.categoryModel.insertMany(
      createDataList,
    );
    return createdCategories;
  }
}
