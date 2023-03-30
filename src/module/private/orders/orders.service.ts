import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.schema';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { transformResult } from '~/utils';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReservationService } from '../reservations/reservation.service';
import { generateOrderId } from '~/utils';
import { OrderType } from './order.schema';

export type OrderFilter = {
  status?: OrderStatus;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly reservationService: ReservationService,
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
  async create(createOrderData: CreateOrderDto) {
    const { reservationId, type } = createOrderData;
    try {
      let existedReservation;
      if (type === OrderType.DINE_IN) {
        existedReservation = await this.reservationService.findById(
          reservationId,
        );
        if (!existedReservation) {
          throw new NotFoundException('Can not find this reservation');
        }
      }

      const created = new this.orderModel({
        ...createOrderData,
        id: generateOrderId(),
        reservationId: existedReservation,
      });
      const result = (await created.save()).toObject();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
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
