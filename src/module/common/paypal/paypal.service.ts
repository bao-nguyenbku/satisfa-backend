import * as paypal from 'paypal-rest-sdk';
import { PaypalTransactions } from './paypal.interface';
import { ConfigService } from '@nestjs/config';

export class PaypalService {
  config: {
    mode: string;
    client_id: string;
    client_secret: string;
  };
  constructor(private readonly configService: ConfigService) {
    this.config.client_id = configService.get<string>('paypalClientId');
    this.config.mode = 'sandbox';
    this.config.client_secret = configService.get<string>('paypalClientSecret');
  }
  async create(paypalTracsactions: PaypalTransactions) {
    try {
      const create_payment_json = {
        intent: 'authorize',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://return.url',
          cancel_url: 'http://cancel.url',
        },
        transactions: [paypalTracsactions],
      };
      paypal.payment.create(
        create_payment_json,
        this.config,
        function (error, payment) {
          if (error) {
            throw error;
          }
          console.log(payment);
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
