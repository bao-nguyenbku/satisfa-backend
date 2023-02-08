import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '~/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
// import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(createProductData: CreateProductDto) {
    // {
    //   productName: 'Bò lúc lắc',
    //   description: '<p>laskdfjlswurowvnx,vnsdhdjkfghueteriotresdlksdljsdweiruwrwoiweuoweurddfgd</p>',
    //   category: '20',
    //   price: '450000',
    //   images: [ '71b9b43721fc2c0c11994be32e2fc990' ]
    // }
    try {
      const productData = new this.productModel(createProductData);
      return productData.save();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAll() {
    try {
      const productList = await this.productModel.find().lean();
      if (Array.isArray(productList)) {
        return productList.map((item) => {
          const { _id, __v, ...newItem } = item;
          return {
            ...newItem,
            id: _id,
          };
        });
      }
      return null;
    } catch (error) {
      throw new Error(error);
    }
  }
}
