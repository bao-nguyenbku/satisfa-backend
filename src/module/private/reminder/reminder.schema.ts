import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from '../categories/category.schema';

export type ReminderDocument = HydratedDocument<Reminder>;

@Schema()
export class Reminder {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  category: Category;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: false, default: true })
  visible: boolean;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
