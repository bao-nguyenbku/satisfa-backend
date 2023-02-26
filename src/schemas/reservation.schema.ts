import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Table } from './table.schema';

export type ReservatonDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
  })
  table: Table;

  @Prop({ required: true })
  from: Date;

  @Prop({ required: true })
  to: Date;



}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
