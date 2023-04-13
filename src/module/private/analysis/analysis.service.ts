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

@Injectable()
export class AnalysisService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly userService: UsersService,
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
        revenue,
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
}
