import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { UploadedFiles } from '@nestjs/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
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
