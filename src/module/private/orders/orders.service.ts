import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, PaymentStatus } from './order.schema';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { transformResult } from '~/utils';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReservationService } from '../reservations/reservation.service';
import { generateOrderId } from '~/utils';
import { OrderType } from './order.schema';
import { OrderFilterDto } from './dto/query-order.dto';
import { PaymentService } from '../payment/payment.service';
import { PaidOrderDto } from './dto/paid-order.dto';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { PaymentCash } from '../payment/payment.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
  ) {}
  async findByFilter(filter?: OrderFilterDto) {
    let filterObj = {};
    if (!_.isEmpty(filter)) {
      filterObj = {
        status: filter.status,
      };
    }
    try {
      const result = await this.orderModel
        .find(filterObj)
        .populate({
          path: 'reservationId reservationId.tableId',
        })
        .populate('customerId', '-password -email -role')
        .populate('paymentInfo', '-orderId')
        .sort({
          createdAt: -1,
        })
        .lean();
      // return result;
      if (result && _.isArray(result)) {
        const newResult = result.map((obj) => {
          delete obj.payment;
          return {
            ...obj,
            totalItem: obj.items.reduce((prev, curr) => prev + curr.qty, 0),
          };
        });
        return transformResult(newResult);
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string): Promise<Order> {
    try {
      const result = await this.orderModel
        .findOne({ id })
        .populate({
          path: 'reservationId reservationId.tableId',
        })
        .populate('customerId', '-password -role')
        .populate('paymentInfo', '-orderId')
        .sort({
          createdAt: -1,
        })
        .lean();

      return transformResult({
        ...result,
        totalItem: result.items.reduce((prev, curr) => prev + curr.qty, 0),
      });
    } catch (error) {
      throw error;
    }
  }
  async create(createOrderData: CreateOrderDto) {
    const { reservationId, type } = createOrderData;
    try {
      let existedReservation;
      if (type === OrderType.DINE_IN) {
        if (!reservationId) {
          throw new BadRequestException('You must send a reservation');
        }
        existedReservation = await this.reservationService.findById(
          reservationId,
        );
        if (!existedReservation) {
          throw new NotFoundException('Can not find this reservation');
        }
      }
      if (type === OrderType.TAKEAWAY) {
        if (!_.has(createOrderData, 'tempCustomer')) {
          throw new BadRequestException('You must send takeaway information');
        }
        const { tempCustomer } = createOrderData;
        if (
          !_.has(tempCustomer, 'name') ||
          _.has(tempCustomer, 'phone') ||
          _.has(tempCustomer, 'takingTime') ||
          _.isEmpty(tempCustomer.name) ||
          _.isEmpty(tempCustomer.phone) ||
          _.isEmpty(tempCustomer.takingTime)
        ) {
          throw new BadRequestException('Takeaway information is required');
        }
      }
      const totalCost = createOrderData.items.reduce(
        (prev, curr) => prev + curr.qty * curr.price,
        0,
      );
      const created = new this.orderModel({
        ...createOrderData,
        totalCost,
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
    try {
      return this.orderModel.findOneAndUpdate({ id }, updateData);
    } catch (error) {
      throw error;
    }
  }
  async paid(id: string, paymentData: PaidOrderDto) {
    try {
      const existedOrder = await this.orderModel.findOne({ id }).lean();
      if (_.isEmpty(existedOrder)) {
        return;
      }
      const payData: CreatePaymentDto = {
        type: paymentData.type,
        info: paymentData.info as PaymentCash,
        orderId: id,
      };
      const createdPayment = await this.paymentService.create(payData);
      // {
      //   id: '733e16fc-b8b9-4682-8f52-5380eb1ae54c',
      //   type: 'CASH',
      //   info: { totalPay: 2000000, totalCost: 1600000 },
      //   orderId: new ObjectId("6425893a090f7e07d2bcba09")
      // }

      if (_.isEmpty(createdPayment)) {
        return;
      }
      const { id: paymentId } = createdPayment;
      return this.update(id, {
        payment: paymentId,
        paymentStatus: PaymentStatus.PAID,
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrderAmount() {
    try {
      return this.orderModel.countDocuments();
    } catch (error) {
      throw error;
    }
  }

  async getBestSeller(amount?: number) {
    try {
      const bestSeller: any = this.orderModel.aggregate([
        {
          $unwind: {
            path: '$items',
          },
        },
        {
          $group: {
            _id: '$items.id',
            name: {
              $first: '$items.name',
            },
            image: {
              $first: '$items.images',
            },
            totalSold: {
              $sum: '$items.qty',
            },
          },
        },
        {
          $sort: {
            totalSold: -1,
          },
        },
        {
          $limit: 4,
        },
      ]);
      return bestSeller;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryStatistic() {
    try {
      const categoryStatistic = this.orderModel.aggregate([
        {
          $unwind: {
            path: '$items',
          },
        },
        {
          $group: {
            _id: '$items.category',
            name: {
              $first: '$items.category',
            },
            totalSold: {
              $sum: '$items.qty',
            },
          },
        },
      ]);
      return transformResult(categoryStatistic);
    } catch (error) {
      throw error;
    }
  }
}
