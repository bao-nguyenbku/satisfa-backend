import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ReservationModule } from '../reservations/reservation.module';

@Module({
  imports: [ReservationModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
