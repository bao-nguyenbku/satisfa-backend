import * as paypal from 'paypal-rest-sdk';
import { PaypalTransactions } from './paypal.interface';

const firstConfig = {
  mode: 'sandbox',
  client_id:
    'AT4fevhY114zql_rgzKoTw-9grpqrzH3ul6CXNnP5k-otXgC1QGaxtoTagkMshrt8RgJnh__rKfaJRNz',
  client_secret:
    'EKZMYpCiHVJ6dWaSLWZnse9cAVS4AO7HwHsdwpVcyufN_NNjUhGBjrXd8GxLxZ5_9Dm5PSPINwS-5tjd',
};

export class PaypalService {
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
        firstConfig,
        function (error, payment) {
          if (error) {
            throw error;
          } else {
            console.log('Create Payment Response');
            console.log(payment);
          }
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
