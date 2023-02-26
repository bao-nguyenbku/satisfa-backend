import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type TableDocument = HydratedDocument<Table>;

@Schema()
export class Table {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: "available" })
  numberOfSeat: number;

  @Prop({ required: true })
  status: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
