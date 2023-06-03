import { Controller, Get, Body, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ReservationService } from '../reservations/reservation.service';

@Controller('mail')
export class MailController {
  constructor(
    readonly mailService: MailService,
    readonly reservationService: ReservationService,
  ) {}

  @Post('remind-reservation')
  public async remindReservation(@Body() sendData: { email: string }) {
    try {
      const reservations = await this.reservationService.findNearestByEmail(
        sendData.email,
      );
      if (reservations && reservations.length > 0) {
        return this.mailService.remindReservation({
          to: sendData.email,
          content: reservations[0],
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
