// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';
// import { User } from '~/module/common/users/user.schema';
// import { Reservation } from '../reservations/reservation.schema';
// import { Product } from '../products/product.schema';
// import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
// // import { Payment } from '~/module/private/payment/payment.schema';
// // import { TakeawayCustomer } from './entities/order.entity';

// export type OrderDocument = HydratedDocument<Order>;

// export enum OrderStatus {
//   NEW = 'NEW',
//   ACCEPTED = 'ACCEPTED',
//   OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
//   COMPLETE = 'COMPLETE',
// }
// export enum PaymentStatus {
//   PAID = 'PAID',
//   UNPAID = 'UNPAID',
// }
// export enum OrderType {
//   TAKEAWAY = 'TAKEAWAY',
//   DINE_IN = 'DINE_IN',
// }
// export class TakeawayCustomer {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsNumber()
//   @IsNotEmpty()
//   phone: number;

//   @IsString()
//   @IsNotEmpty()
//   takingTime: string;
// }
// @Schema({ timestamps: true })
// export class Order {
//   @Prop({ required: true, unique: true })
//   id: string;

//   @Prop({ required: true })
//   totalCost: number;

//   @Prop({ required: true, default: PaymentStatus.UNPAID })
//   paymentStatus: PaymentStatus;

//   @Prop({
//     required: false,
//   })
//   payment: string;

//   @Prop({ required: true, default: OrderStatus.NEW })
//   status: OrderStatus;

//   @Prop({ required: true, default: OrderType.DINE_IN })
//   type: OrderType;

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     required: false,
//     ref: 'User',
//   })
//   customerId: User;

//   @Prop({
//     required: false,
//   })
//   @Prop({
//     required: false,
//   })
//   tempCustomer: TakeawayCustomer;
//   @Prop({
//     required: false,
//   })
//   reservationId: Reservation;

//   @Prop({ required: true })
//   items: (Product & { qty: number })[];
// }

// export const OrderSchema = SchemaFactory.createForClass(Order);
