import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import { transformResult } from '~/utils';
import * as _ from 'lodash';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.schema';

export type OrderFilter = {
  status?: OrderStatus;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}
  async findByFilter(filter: OrderFilter) {
    const { status } = filter;
    if (!_.isEmpty(status)) {
      if (!Object.values(OrderStatus).includes(status)) {
        throw new HttpException(
          `${status} is not a valid status`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      const result = await this.orderModel
        .find({
          status,
        })
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

  async update(id: string, updateData: UpdateOrderDto) {
    const { status } = updateData;
    if (!Object.values(OrderStatus).includes(status)) {
      throw new HttpException(
        `${status} is not a valid status`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return this.orderModel.findOneAndUpdate(
        { id },
        {
          status,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
