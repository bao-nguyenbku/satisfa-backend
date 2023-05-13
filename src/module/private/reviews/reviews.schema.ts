import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '~/module/common/users/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  customerId: User;

  @Prop({
    required: true,
  })
  review: string;

  @Prop({
    required: false,
    default: 0,
  })
  foodRating: number;

  @Prop({
    required: false,
    default: 0,
  })
  serviceRating: number;

  @Prop({ required: false, default: true })
  visible: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
