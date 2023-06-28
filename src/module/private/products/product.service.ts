import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '~/module/private/products/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
// import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';
import { transformResult } from '~/utils';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async update(id: string, updateData: UpdateProductDto): Promise<any> {
    try {
      const updated = await this.productModel
        .findByIdAndUpdate(id, updateData, { runValidators: true })
        .lean();
      return transformResult(updated);
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string): Promise<ProductEntity> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotAcceptableException('This is not a valid id');
      }
      const product = await this.productModel.findById(id).lean();
      // TODO Handle case product null;
      if (!product) {
        return null;
      }
      return transformResult(product);
    } catch (error) {
      throw error;
    }
  }
  async createProduct(createProductData: CreateProductDto) {
    // {
    //   productName: 'Bò lúc lắc',
    //   description: '<p>laskdfjlswurowvnx,vnsdhdjkfghueteriotresdlksdljsdweiruwrwoiweuoweurddfgd</p>',
    //   category: '2347392473974359232',
    //   price: '450000',
    //   images: [ '71b9b43721fc2c0c11994be32e2fc990' ]
    // }
    try {
      const productData = new this.productModel(createProductData);
      return transformResult((await productData.save()).toObject());
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      const result = await this.productModel
        .find()
        .populate('category', 'name')
        .lean();

      if (result && Array.isArray(result)) {
        return transformResult(
          result.map((item) => {
            return {
              ...item,
              category: item.category?.name,
            };
          }),
        );
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const deleted = await this.productModel.deleteOne({ _id: id }).lean();
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}
