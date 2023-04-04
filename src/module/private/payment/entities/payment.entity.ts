import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '../payment.schema';
import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { PaymentCash } from '../payment.schema';
import { Type } from 'class-transformer';
import { Order } from '../../orders/order.schema';

export class PaymentEntity {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PaymentCash)
  info: PaymentCash;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Order)
  orderId: Order;
}
