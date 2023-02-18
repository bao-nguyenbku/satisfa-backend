import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '~/schemas/category.schema';
import { Model } from 'mongoose';
import { CategoryResponse } from './dto/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    try {
      const result = await this.categoryModel.find().lean();
      const newResult = result.map((data) => {
        const { _id: id, __v, ...rest } = data;
        return {
          id,
          ...rest,
        };
      });
      return newResult;
    } catch (error) {
      throw error;
    }
  }

  async create(createData: CreateCategoryDto) {
    try {
      const createdCategory = new this.categoryModel(createData);
      const insertedData = (await createdCategory.save()).toObject();
      return {
        id: insertedData._id,
        name: insertedData.name,
      };
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
