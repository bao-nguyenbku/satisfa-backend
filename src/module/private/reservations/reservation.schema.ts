import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '~/module/common/users/user.schema';
import { Table } from '~/module/private/tables/table.schema';

export type ReservatonDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  customerId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  })
  tableId: Table;

  @Prop({ required: true })
  numberOfGuests: number;

  @Prop({ required: true })
  date: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);