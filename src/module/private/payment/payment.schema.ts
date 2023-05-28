import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { Order } from '../orders/order.schema';
// import mongoose from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;
export enum PaymentType {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  E_WALLET = 'E_WALLET',
}

export class PaymentCash {
  @Prop()
  @IsNumber()
  totalPay: number;

  @Prop()
  @IsNumber()
  totalCost: number;
}
@Schema({ timestamps: true })
export class Payment {
  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({ required: true, default: PaymentType.CASH })
  type: PaymentType;

  @Prop({ required: true, type: Object })
  info: PaymentCash | object;

  // @Prop({
  //   required: true,
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Order',
  // })
  @Prop({
    required: true,
    unique: true,
  })
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
