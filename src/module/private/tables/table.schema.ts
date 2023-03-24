import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reservation } from '../reservations/reservation.schema';

export type TableDocument = HydratedDocument<Table>;
export enum TableStatus {
  FREE = 'FREE',
  CHECKED_IN = 'CHECKED_IN',
  RESERVED = 'RESERVED',
}
@Schema()
export class Table {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
  ])
  reservations: (Reservation & { _id: mongoose.Schema.Types.ObjectId })[];
}

export const TableSchema = SchemaFactory.createForClass(Table);
