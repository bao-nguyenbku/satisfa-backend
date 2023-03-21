import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import { transformResult } from '~/utils';
import * as _ from 'lodash';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}
  async findAll() {
    try {
      const result = await this.orderModel
        .find()
        .populate({
          path: 'reservationId',
          populate: {
            path: 'tableId',
          },
        })
        .populate('customerId', '-password -email -role')
        .sort({
          createdAt: -1,
        })
        .lean();
      // return result;
      if (result && _.isArray(result)) {
        return transformResult(
          result.map((obj) => {
            return {
              ...obj,
              totalItem: obj.items.reduce((prev, curr) => prev + curr.qty, 0),
            };
          }),
        );
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
  async create(createOrderData: any) {
    const created = new this.orderModel(createOrderData);
    return created.save();
  }
}
