import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(@InjectConnection() connection: Connection) {
    if (connection) {
      console.log('DATABASE IS CONNECTED');
    }
  }
  @Get('healthcheck')
  async checkServer(@Req() req: Request, @Res() res: Response) {
    const fullUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    res.send(`Server is running at ${fullUrl}`);
  }
}
