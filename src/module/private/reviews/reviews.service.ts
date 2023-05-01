import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './reviews.schema';
import { transformResult } from '~/utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewFilter } from './dto/review-filter.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const createdReview = new this.reviewModel(createReviewDto);
      return transformResult((await createdReview.save()).toObject());
    } catch (error) {
      throw error;
    }
  }

  async findAll(filter: ReviewFilter) {
    const { limit } = filter;
    try {
      const result = await this.reviewModel
        .find()
        .populate('customerId', 'fullname avatar -_id')
        .limit(limit)
        .lean();
      return transformResult(result);
    } catch (error) {}
  }

  async findById() {
    return;
  }
}
