import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Payment,
  PaymentDocument,
} from '~/module/private/payment/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { generateId, transformResult } from '~/utils';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentData: CreatePaymentDto) {
    try {
      const newPayment = new this.paymentModel({
        id: generateId(),
        ...createPaymentData,
      });
      const result = await newPayment.save();
      return transformResult(result.toObject());
    } catch (error) {
      throw error;
    }
  }

  async getIncomeStatistic(timeFilter?: string) {
    try {
      const date = new Date();
      const incomeList: any = this.paymentModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte:
                timeFilter == 'year'
                  ? new Date(date.getFullYear(), 0, 1)
                  : new Date(date.getFullYear(), date.getMonth(), 1),
              $lt:
                timeFilter == 'year'
                  ? new Date(date.getFullYear(), 11, 31)
                  : new Date(date.getFullYear(), date.getMonth() + 1, 0),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString:
                timeFilter == 'month'
                  ? { format: '%Y-%m-%d', date: '$createdAt' }
                  : { format: '%Y-%m', date: '$createdAt' },
            },
            totalSaleAmount: { $sum: '$info.totalCost' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      return transformResult(incomeList);
    } catch (error) {}
  }
}
