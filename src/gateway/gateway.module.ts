import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { SatisgiService } from '~/satisgi/satisgi.service';

@Module({
  providers: [Gateway, SatisgiService],
})
export class GatewayModule {}
