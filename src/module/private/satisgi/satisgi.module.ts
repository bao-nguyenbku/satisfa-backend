import { Module } from '@nestjs/common';
import { SatisgiService } from './satisgi.service';

@Module({
  providers: [SatisgiService],
})
export class SatisgiModule {}
