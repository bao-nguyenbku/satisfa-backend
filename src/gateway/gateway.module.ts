import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { UsersModule } from '~/module/common/users/user.module';
// import { SatisgiService } from '~/module/private/satisgi/satisgi.service';

@Module({
  imports: [UsersModule],
  providers: [Gateway],
})
export class GatewayModule {}
