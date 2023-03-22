import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;
export enum TableStatus {
  FREE = 'FREE',
  CHECKED_IN = 'CHECKED_IN',
  RESERVED = 'RESERVED',
}
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'lastUpdate',
  }})
export class Table {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop({ required: false, enum: TableStatus, default: TableStatus.FREE })
  status: TableStatus;

  @Prop()
  createdAt: string;

  @Prop()
  lastUpdate: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
