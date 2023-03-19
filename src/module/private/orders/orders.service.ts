import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import { transformResult } from '~/utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}
  async findAll() {
    try {
      const result = await this.orderModel.find().lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }
  async create(createOrderData: any) {
    const created = new this.orderModel(createOrderData);
    return created.save();
  }
}
