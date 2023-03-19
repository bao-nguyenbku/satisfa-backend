import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '~/module/common/users/user.schema';
import { Reservation } from '../reservations/reservation.schema';
import { Product } from '../products/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  totalCost: number;

  // !Warning: temporary use 'string'. Change later
  // enum PaymentStatus = [UNPAID, PAID]
  @Prop({ required: true, default: 'UNPAID' })
  paymentStatus: string;

  // !Warning: temporary use 'string'. Change later
  // enum Status = [NEW,..., COOKING, OUT_FOR_DELIVERY, COMPLETE]
  @Prop({ required: true, default: 'NEW' })
  status: string;

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
