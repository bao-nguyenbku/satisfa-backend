import { Controller, Get, Body, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ReservationService } from '../reservations/reservation.service';

@Controller('mail')
export class MailController {
  constructor(
    readonly mailService: MailService,
    readonly reservationService: ReservationService,
  ) {}

  @Get('remind-reservation')
  public async remindReservation() {
    try {
      const reservations = await this.reservationService.findNearestReserved();
      if (reservations && reservations.length > 0) {
        return this.mailService.remindReservation(reservations);
      }
    } catch (error) {
      throw error;
    }
  }
}
