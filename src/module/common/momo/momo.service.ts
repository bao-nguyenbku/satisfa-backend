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

// const payment = (request, response) => {
//   const partnerCode = process.env.PARTNER_CODE;
//   const accessKey = process.env.ACCESS_KEY;
//   const secretKey = process.env.SECRET_KEY;
//   const requestId = partnerCode + new Date().getTime();
//   const orderId = requestId;
//   const orderInfo = 'pay with MoMo';
//   const redirectUrl = 'http://localhost:3000/complete';
//   const ipnUrl = 'https://callback.url/notify';
//   const requestType = 'captureWallet';
//   const extraData = ''; //pass empty value if your merchant does not have stores
//   const amount = request.body.amount;

//   //before sign HMAC SHA256 with format
//   const rawSignature =
//     'accessKey=' +
//     accessKey +
//     '&amount=' +
//     amount +
//     '&extraData=' +
//     extraData +
//     '&ipnUrl=' +
//     ipnUrl +
//     '&orderId=' +
//     orderId +
//     '&orderInfo=' +
//     orderInfo +
//     '&partnerCode=' +
//     partnerCode +
//     '&redirectUrl=' +
//     redirectUrl +
//     '&requestId=' +
//     requestId +
//     '&requestType=' +
//     requestType;

//signature
// console.log('assd');
// const signature = crypto
//   .createHmac('sha256', secretKey)
//   .update(rawSignature)
//   .digest('hex');
//json object send to MoMo endpoint
//   const requestBody = JSON.stringify({
//     partnerCode: partnerCode,
//     accessKey: accessKey,
//     requestId: requestId,
//     amount: amount,
//     orderId: orderId,
//     orderInfo: orderInfo,
//     redirectUrl: redirectUrl,
//     ipnUrl: ipnUrl,
//     extraData: extraData,
//     requestType: requestType,
//     signature: signature,
//     lang: 'en',
//   });

//   //Create the HTTPS objects
//   const options = {
//     hostname: 'test-payment.momo.vn',
//     port: 443,
//     path: '/v2/gateway/api/create',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(requestBody),
//     },
//   };

//   //Send the request and get the response
//   const req = https.request(options, (res) => {
//     res.setEncoding('utf8');
//     res.on('data', (body) => {
//       // console.log(JSON.parse(body));
//       response.send(JSON.parse(body).payUrl);
//     });
//     res.on('end', () => {
//       console.log('No more data in response.');
//     });
//   });

//   req.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`);
//   });

//   // write data to request body
//   console.log('Sending....');
//   req.write(requestBody);
//   req.end();
// };

// export default payment;
