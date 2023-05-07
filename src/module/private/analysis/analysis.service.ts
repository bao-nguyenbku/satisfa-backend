import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import {
//   Order,
//   OrderDocument,
//   PaymentStatus,
// } from '~/module/private/orders/order.schema';
// import { Model } from 'mongoose';
// import * as _ from 'lodash';
// import { transformResult } from '~/utils';
// import { ReservationService } from '../reservations/reservation.service';
// import { generateOrderId } from '~/utils';
// import { OrderType } from './analysis.schema';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '~/module/common/users/user.service';
import { ReservationService } from '../reservations/reservation.service';
import { PaymentService } from '~/module/private/payment/payment.service';
import { ReviewsService } from '~/module/private/reviews/reviews.service';
import { countFrequencyOfReviewStar } from '~/utils';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly userService: UsersService,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async getOrderAmount() {
    try {
      const orders = await this.orderService.getOrderAmount();
      return {
        numberOfOrders: orders,
      };
    } catch (error) {
      throw error;
    }
  }

  async calculateRevenueFromOrder() {
    try {
      const orders = await this.orderService.findByFilter();
      const revenue = orders.reduce((prev, curr) => prev + curr.totalCost, 0);
      return {
        totalRevenue: revenue,
        allOrders: orders,
      };
    } catch (error) {
      throw error;
    }
  }

  async countCustomer() {
    try {
      const customers = await this.userService.countCustomer();
      return {
        numberOfCustomers: customers,
      };
    } catch (error) {
      throw error;
    }
  }

  async countReservation() {
    try {
      const reservations = await this.reservationService.countReservations();
      return {
        totalReservations: reservations,
      };
    } catch (error) {
      throw error;
    }
  }

  async bestSeller(amount?: number) {
    try {
      const bestSeller = await this.orderService.getBestSeller(amount);
      return bestSeller;
    } catch (error) {
      throw error;
    }
  }

  async getLastestCustomer(amount?: number) {
    try {
      const customerList = await this.userService.getLastestCustomer(amount);
      return customerList;
    } catch (error) {
      throw error;
    }
  }

  async getIncomeStatistic(timeFilter?: string) {
    try {
      const incomeList = await this.paymentService.getIncomeStatistic(
        timeFilter,
      );
      return incomeList;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryStatistic() {
    try {
      const categoryList = await this.orderService.getCategoryStatistic();
      return categoryList;
    } catch (error) {
      throw error;
    }
  }

  async getTotalpayByUser() {
    try {
      const userList = await this.orderService.getTotalpayByUser();
      return userList;
    } catch (error) {
      throw error;
    }
  }

  async calculateRatingQuality() {
    try {
      const result = await this.reviewsService.findAll();
      const foodRatingResult = result.filter((item) => item.foodRating !== 0);
      const serviceRatingResult = result.filter(
        (item) => item.serviceRating !== 0,
      );

      return {
        overallRating:
          (foodRatingResult.reduce((prev, curr) => prev + curr.foodRating, 0) +
            serviceRatingResult.reduce(
              (prev, curr) => prev + curr.serviceRating,
              0,
            )) /
          (foodRatingResult.length + serviceRatingResult.length),
        totalReview: result.length,
        data: [
          {
            title: 'Food Quality',
            overall:
              foodRatingResult.reduce(
                (prev, curr) => prev + curr.foodRating,
                0,
              ) / foodRatingResult.length,
            totalRating: foodRatingResult.length,
            distribution: {
              1: countFrequencyOfReviewStar(foodRatingResult, 1, 'foodRating'),
              2: countFrequencyOfReviewStar(foodRatingResult, 2, 'foodRating'),
              3: countFrequencyOfReviewStar(foodRatingResult, 3, 'foodRating'),
              4: countFrequencyOfReviewStar(foodRatingResult, 4, 'foodRating'),
              5: countFrequencyOfReviewStar(foodRatingResult, 5, 'foodRating'),
            },
          },
          {
            title: 'Service Quality',
            overall:
              serviceRatingResult.reduce(
                (prev, curr) => prev + curr.serviceRating,
                0,
              ) / serviceRatingResult.length,
            totalRating: serviceRatingResult.length,
            distribution: {
              1: countFrequencyOfReviewStar(
                serviceRatingResult,
                1,
                'serviceRating',
              ),
              2: countFrequencyOfReviewStar(
                serviceRatingResult,
                2,
                'serviceRating',
              ),
              3: countFrequencyOfReviewStar(
                serviceRatingResult,
                3,
                'serviceRating',
              ),
              4: countFrequencyOfReviewStar(
                serviceRatingResult,
                4,
                'serviceRating',
              ),
              5: countFrequencyOfReviewStar(
                serviceRatingResult,
                5,
                'serviceRating',
              ),
            },
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  }
}
