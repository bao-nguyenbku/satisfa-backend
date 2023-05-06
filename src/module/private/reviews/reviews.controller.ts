import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Request,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewFilter } from './dto/review-filter.dto';

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

  @Get('')
  @UseFilters(MongoExceptionFilter)
  async findAllReview(@Query() filter: ReviewFilter) {
    return this.reviewService.findAll(filter);
  }

  async findReviewById() {
    return this.reviewService.findById();
  }
}
