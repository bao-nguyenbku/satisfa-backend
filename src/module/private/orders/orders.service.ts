import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
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
import { TempOrder, TempOrderDocument } from './temp-order.schema';
import { User, UserDocument } from '~/module/common/users/user.schema';
import * as dayjs from 'dayjs';
import { PaymentType } from '../payment/payment.schema';

@Injectable({ scope: Scope.REQUEST })
export class OrdersService {
  constructor(
    @InjectModel(TempOrder.name)
    private tempOrderModel: Model<TempOrderDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reservationService: ReservationService,
    private readonly paymentService: PaymentService,
  ) {}
  async findByFilter(filter?: OrderFilterDto, userId?: string) {
    const filterObj = {};
    if (!_.isEmpty(filter)) {
      const { status, currentDate, currentUser } = filter;
      if (status) {
        filterObj['status'] = status;
      }
      if (currentDate) {
        const current = dayjs()
          .set('hour', 0)
          .set('minute', 0)
          .set('second', 0)
          .set('millisecond', 0);
        const tomorrow = current.add(1, 'day');

        filterObj['createdAt'] = {
          $gte: current.toISOString(),
          $lt: tomorrow.toISOString(),
        };
      }
      if (currentUser) {
        filterObj['customerId'] = userId ? userId : '';
      }
      // if (_.has(filter, 'currentUser') && filter.currentUser === true) {
      //   filterObj['customerId'] = userId ? userId : '';
      // }
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
        .limit(filter?.lastest === true ? 1 : 0)
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
  // async findByLastWeek() {
  //   try {
  //     const result = await this.orderModel
  //       .find({cre})
  //       .populate({
  //         path: 'reservationId reservationId.tableId',
  //       })
  //       .populate('customerId', '-password -email -role')
  //       .populate('paymentInfo', '-orderId')
  //       .sort({
  //         createdAt: -1,
  //       })
  //       .lean();
  //     // return result;
  //     if (result && _.isArray(result)) {
  //       const newResult = result.map((obj) => {
  //         delete obj.payment;
  //         return {
  //           ...obj,
  //           totalItem: obj.items.reduce((prev, curr) => prev + curr.qty, 0),
  //         };
  //       });
  //       return transformResult(newResult);
  //     }
  //     return [];
  //   } catch (error) {
  //     throw error;
  //   }
  // }
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
        // console.log(createOrderData);
        // console.log(tempCustomer);
        // console.log(_.isEmpty(tempCustomer.name));
        // console.log(_.isNumber(tempCustomer.phone));
        // console.log(_.isEmpty(tempCustomer.takingTime));
        if (
          !_.has(tempCustomer, 'name') ||
          !_.has(tempCustomer, 'phone') ||
          !_.has(tempCustomer, 'takingTime')
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
  async createTemp(createOrderData: CreateOrderDto) {
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
        // console.log(createOrderData);
        // console.log(tempCustomer);
        // console.log(_.isEmpty(tempCustomer.name));
        // console.log(_.isNumber(tempCustomer.phone));
        // console.log(_.isEmpty(tempCustomer.takingTime));
        if (
          !_.has(tempCustomer, 'name') ||
          !_.has(tempCustomer, 'phone') ||
          !_.has(tempCustomer, 'takingTime')
        ) {
          throw new BadRequestException('Takeaway information is required');
        }
      }
      const totalCost = createOrderData.items.reduce(
        (prev, curr) => prev + curr.qty * curr.price,
        0,
      );
      const created = new this.tempOrderModel({
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
  async updateTemp(id: string, updateData: UpdateOrderDto) {
    try {
      return this.tempOrderModel.findOneAndUpdate({ id }, updateData);
    } catch (error) {
      throw error;
    }
  }
  async deleteTemp(id: string) {
    try {
      return this.tempOrderModel.findOneAndDelete({ id });
    } catch (error) {
      throw error;
    }
  }
  async paid(id: string, paymentData: PaidOrderDto) {
    try {
      if (paymentData.type == PaymentType.CREDIT) {
        console.log('temp');
        return this.paidTempOrder(id, paymentData);
      }
      console.log('main');
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
  async paidTempOrder(id: string, paymentData: PaidOrderDto) {
    try {
      console.log('go here');
      const existedOrder = await this.tempOrderModel.findOne({ id }).lean();
      if (_.isEmpty(existedOrder)) {
        console.log('empty');
        return;
      }
      const insertedOrder = await this.orderModel.insertMany(existedOrder);
      if (_.isEmpty(insertedOrder)) {
        return;
      }
      console.log('here');
      const payData: CreatePaymentDto = {
        type: paymentData.type,
        info: paymentData.info as PaymentCash,
        orderId: id,
      };
      const createdPayment = await this.paymentService.create(payData);

      if (_.isEmpty(createdPayment)) {
        return;
      }

      const deletedOrder = await this.deleteTemp(id);
      if (_.isEmpty(deletedOrder)) {
        return;
      }
      const { id: paymentId } = createdPayment;
      return this.update(id, {
        payment: paymentId,
        paymentStatus: PaymentStatus.PAID,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOrderAmount() {
    try {
      let today = new Date();
      const start = new Date(
        today.setDate(today.getDate() - today.getDay() - 6),
      ).getTime();
      today = new Date();
      const end = new Date(
        today.setDate(today.getDate() - today.getDay()),
      ).getTime();

      const orders = await this.findByFilter();
      const filterOrders = orders.filter(
        (item) =>
          new Date(item.createdAt).getTime() >= start &&
          new Date(item.createdAt).getTime() <= end,
      );
      return filterOrders.length;
    } catch (error) {
      throw error;
    }
  }

  async getBestSeller(filter?: number) {
    try {
      if (Object.keys(filter).length == 0) {
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
              price: {
                $first: '$items.price',
              },
              // percent: {
              //   $
              // }
            },
          },
          {
            $sort: {
              totalSold: -1,
            },
          },
        ]);
        return bestSeller;
      } else {
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
              price: {
                $first: '$items.price',
              },
              totalSold: {
                $sum: '$items.qty',
              },
              // percent: {
              //   $
              // }
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
      }
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

  async getTotalpayByUser() {
    try {
      const userList = this.orderModel
        .aggregate([
          {
            $match: {
              paymentStatus: 'PAID',
            },
          },
          {
            $group: {
              _id: '$customerId',
              totalPay: {
                $sum: '$totalCost',
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $project: {
              fullname: '$user.fullname',
              totalPay: '$totalPay',
              avatar: '$user.avatar',
            },
          },
        ])
        .exec();
      return userList;
    } catch (error) {
      throw error;
    }
  }
}
