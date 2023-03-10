import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default:
      'https://blogchomeo.com/wp-content/uploads/2021/06/nguon-goc-xuat-xu-cho-corgi.jpg',
  })
  avatar: string;

  @Prop({
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
