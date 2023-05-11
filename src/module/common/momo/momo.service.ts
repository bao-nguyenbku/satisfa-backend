//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
import * as crypto from 'crypto';
import * as https from 'https';
import { CreateMomoData } from './momo-interface';

export class MomoService {
  async create(createData: CreateMomoData) {
    try {
      const rawSignature =
        'accessKey=' +
        createData.accessKey +
        '&amount=' +
        createData.amount +
        '&extraData=' +
        createData.extraData +
        '&ipnUrl=' +
        createData.ipnUrl +
        '&orderId=' +
        createData.orderId +
        '&orderInfo=' +
        createData.orderInfo +
        '&partnerCode=' +
        createData.partnerCode +
        '&redirectUrl=' +
        createData.redirectUrl +
        '&requestId=' +
        createData.requestId +
        '&requestType=' +
        createData.requestType;
      const signature = crypto
        .createHmac('sha256', createData.secretKey)
        .update(rawSignature)
        .digest('hex');
      createData.lang = 'en';
      createData.signature = signature;
      const requestBody = JSON.stringify(createData);
      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };
      //Send the request and get the response
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (body) => {
          console.log(JSON.parse(body));
          // response.send(JSON.parse(body).payUrl);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
      });

      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });

      // write data to request body
      console.log('Sending....');
      req.write(requestBody);
      req.end();
    } catch (error) {
      throw error;
    }
  }
}
