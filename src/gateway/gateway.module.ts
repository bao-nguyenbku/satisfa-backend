import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { SatisgiService } from '~/module/private/satisgi/satisgi.service';

@Module({
  providers: [Gateway, SatisgiService],
})
export class GatewayModule {}
