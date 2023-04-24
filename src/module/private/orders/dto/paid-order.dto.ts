import { Type } from 'class-transformer';
import { IsEnum, ValidateNested, IsNotEmpty } from 'class-validator';
import { PaymentType } from '~/module/private/payment/payment.schema';
import { PaymentCash } from '~/module/private/payment/payment.schema';

export class PaidOrderDto {
  @IsEnum(PaymentType)
  @IsNotEmpty()
  type: PaymentType;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PaymentCash)
  info: PaymentCash | object;
}
