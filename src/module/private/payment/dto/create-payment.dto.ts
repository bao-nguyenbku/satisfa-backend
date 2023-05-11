import { OmitType } from '@nestjs/swagger';
import { PaymentEntity } from '../entities/payment.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto extends OmitType(PaymentEntity, [
  'id',
  'orderId',
]) {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
