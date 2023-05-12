import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './reviews.schema';
import { transformResult } from '~/utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewFilter } from './dto/review-filter.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/order.schema';
import { UpdateReviewDto } from './dto/update-review.dto';
import mongoose from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly ordersService: OrdersService,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const orders = await this.ordersService.findByFilter(
        {
          currentUser: true,
          status: OrderStatus.COMPLETE,
        },
        createReviewDto.customerId,
      );
      if (orders.length === 0) {
        throw new BadRequestException(
          'This user can not write review because of not using any services',
        );
      }
      const createdReview = new this.reviewModel(createReviewDto);
      return transformResult((await createdReview.save()).toObject());
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, updateReviewDto: UpdateReviewDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('This is not a valid id');
    const result = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto)
      .lean();
    return transformResult(result);
  }
  async findAll(filter?: ReviewFilter): Promise<Review[]> {
    const { limit } = filter
      ? filter
      : {
          limit: undefined,
        };
    try {
      const result = await this.reviewModel
        .find()
        .populate('customerId', 'fullname avatar -_id')
        .limit(limit)
        .lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }
  async findAllVisible(filter?: ReviewFilter) {
    const { limit } = filter
      ? filter
      : {
          limit: undefined,
        };
    try {
      const result = await this.reviewModel
        .find({
          visible: true,
        })
        .populate('customerId', 'fullname avatar -_id')
        .limit(limit)
        .lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }

  async findById() {
    return;
  }
}
