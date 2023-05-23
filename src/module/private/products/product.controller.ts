import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER, Role.ADMIN)
  @Get()
  async getAllProduct() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/create')
  async createProduct(@Body() createProductData: CreateProductDto) {
    return this.productService.createProduct(createProductData);
  }

  @Get('/:id')
  @UseFilters(MongoExceptionFilter)
  async getProductById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @Patch('/:id')
  async updateProduct(
    @Body() updateData: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productService.update(id, updateData);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
