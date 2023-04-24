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
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly userService: UsersService,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
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
}
