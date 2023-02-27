import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getAllProduct() {
    return this.productService.findAll();
  }

  @Post('/create')
  async createProduct(@Body() createProductData: CreateProductDto) {
    return this.productService.createProduct(createProductData);
  }

  @Get('/:id')
  @UseFilters(MongoExceptionFilter)
  async getProductById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch('/:id')
  async updateProduct(
    @Body() updateData: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productService.update(id, updateData);
  }

  @Delete('/:id')
  @UseFilters(MongoExceptionFilter)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
