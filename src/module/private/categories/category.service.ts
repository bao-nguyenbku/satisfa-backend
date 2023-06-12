import { BadRequestException, Injectable } from '@nestjs/common';
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
import { ProductDocument, Product } from '../products/product.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    try {
      const result = await this.categoryModel
        .find({
          name: {
            $ne: '',
          },
        })
        .lean();
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

  async delete(id: string) {
    try {
      const existed = await this.productModel.findOne({
        category: id,
      });
      if (existed) {
        throw new BadRequestException('This category has already in use');
      }
      return this.categoryModel.findByIdAndDelete(id).lean();
    } catch (error) {
      throw error;
    }
  }
}
