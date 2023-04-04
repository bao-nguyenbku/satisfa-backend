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
}
