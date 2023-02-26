import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({ required: true })
  seat: number;

  @Prop({ default: "available" })
  status: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: "" })
  from: string;

  @Prop({ required: "" })
  to: string;



}

export const TableSchema = SchemaFactory.createForClass(Table);
