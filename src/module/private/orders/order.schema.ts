import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '~/module/common/users/user.schema';
import { Reservation } from '../reservations/reservation.schema';
import { Product } from '../products/product.schema';
import { generateOrderId } from '~/utils';

export type OrderDocument = HydratedDocument<Order>;
export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  COMPLETE = 'COMPLETE',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}
@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, default: generateOrderId(), unique: true })
  id: string;

  @Prop({ required: true })
  totalCost: number;

  // enum PaymentStatus = [UNPAID, PAID]
  @Prop({ required: true, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  // enum Status = [NEW,..., COOKING, OUT_FOR_DELIVERY, COMPLETE]
  @Prop({ required: true, default: OrderStatus.NEW })
  status: OrderStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  customerId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Reservation',
  })
  reservationId: Reservation;

  @Prop({ required: true })
  items: (Product & { qty: number })[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);