import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

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
}
