import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseFilters,
  ValidationPipe,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getAllCategory() {
    return this.categoryService.findAll();
  }

  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateById(
    @Param('id') id: string,
    @Body() updateDataDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateById(id, updateDataDto);
  }
  @Post('/create')
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createCategory(
    @Body() createCategoryData: CreateCategoryDto[] | CreateCategoryDto,
  ) {
    if (Array.isArray(createCategoryData)) {
      return this.categoryService.createMany(createCategoryData);
    }
    return this.categoryService.create(createCategoryData);
  }
}
