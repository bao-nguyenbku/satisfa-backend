import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  UseFilters,
  Request,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewFilter } from './dto/review-filter.dto';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  async createReview(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewService.create({
      ...createReviewDto,
      customerId: req.user.id as any,
    });
  }

  // API for customer
  @Get('')
  @UseFilters(MongoExceptionFilter)
  async findAllVisibleReview(@Query() filter: ReviewFilter) {
    return this.reviewService.findAllVisible(filter);
  }

  // API for ADMIN
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseFilters(MongoExceptionFilter)
  async findAllReview(@Query() filter: ReviewFilter) {
    return this.reviewService.findAll(filter);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseFilters(MongoExceptionFilter)
  async updateReviewById(@Param('id') id: string, @Body() updateDataDto: any) {
    return this.reviewService.update(id, updateDataDto);
  }

  async findReviewById() {
    return this.reviewService.findById();
  }
}
