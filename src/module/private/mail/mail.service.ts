import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { RemindReservationDto } from './dto/remind-reservation.dto';
import * as dayjs from 'dayjs';
import { ReservationEntity } from '../reservations/entities/reservation.entity';
import { ReservationService } from '../reservations/reservation.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly reservationService: ReservationService,
  ) {}
  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get<string>('googleClientId'),
      this.configService.get<string>('googleClientSecret'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.configService.get<string>('googleRefreshToken'),
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('googleEmailUser'),
        clientId: this.configService.get<string>('googleClientId'),
        clientSecret: this.configService.get<string>('googleClientSecret'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  // public async sendMail() {
  //   try {
  //     await this.setTransport();
  //     await this.mailerService.sendMail({
  //       transporterName: 'gmail',
  //       to: 'thekingworld9191@gmail.com', // list of receivers
  //       from: 'noreply@satisfa.com', // sender address
  //       subject: 'Setup email', // Subject line
  //       template: './mail',
  //       sender: 'Satisfa',
  //       context: {
  //         // Data to be sent to template engine..
  //         name: 'This is Satisfa',
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  public async remindReservation(reservations: ReservationEntity[]) {
    try {
      const scheduleForMail: ReservationEntity[] = [];
      reservations.forEach((reserve) => {
        const gap = dayjs(reserve.date).diff(dayjs(), 'day', true);
        if (gap > 0 && gap < 2 && !reserve.isRemind) {
          scheduleForMail.push(reserve);
        }
      });
      if (scheduleForMail.length === 0) {
        return [];
      }

      await this.setTransport();
      const result = await Promise.all(
        scheduleForMail.map(async (reserve) => {
          return this.mailerService.sendMail({
            transporterName: 'gmail',
            to: reserve.customerId.email,
            subject: '[Satisfa Restaurant] - Remind reservation schedule',
            template: './remind-reservation',
            sender: 'Satisfa',
            context: {
              // Data to be sent to template engine
              fullname: reserve.customerId.fullname,
              date: `${dayjs(reserve.date).format(
                'dddd, DD/MM/YYYY',
              )} at ${dayjs(reserve.date).format('h:mm A')}`,
            },
          });
        }),
      );
      if (result && result.length > 0) {
        return Promise.all(
          scheduleForMail.map(async (reserve) => {
            return this.reservationService.update(reserve.id, {
              isRemind: true,
            });
          }),
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
