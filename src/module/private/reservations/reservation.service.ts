import {
  Injectable,
  NotAcceptableException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reserve.dto';
import mongoose from 'mongoose';
import {
  Reservation,
  ReservationStatus,
  ReservatonDocument,
} from '~/module/private/reservations/reservation.schema';
import { ReservationFilter } from './dto/query-reserve.dto';
import { UpdateReservationDto } from './dto/update-reserve.dto';
import { TableService } from '../tables/table.service';
import { UsersService } from '~/module/common/users/user.service';
import { transformResult } from '~/utils';
import {
  GAP_BETWEEN_RESERVATIONS,
  MILESTONE_CANCEL_RESERVATION,
} from '~/constants';
import { Role } from '~/constants/role.enum';

Injectable();
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservatonDocument>,
    private readonly tableService: TableService,
    private readonly userService: UsersService,
  ) {}
  async findByFilter(filter?: ReservationFilter, userId?: string) {
    try {
      if (_.isEmpty(filter)) {
        const result = await this.reservationModel
          .find()
          .populate('tableId')
          .populate('customerId', 'fullname avatar')
          .lean();
        return transformResult(result);
      }
      const filterObj = {};
      const { currentDate, currentUser, date, user, checkedIn, fromNow } =
        filter;
      if (currentDate) {
        const current = dayjs()
          .set('hour', 0)
          .set('minute', 0)
          .set('second', 0)
          .set('millisecond', 0);
        const tomorrow = current.add(1, 'day');
        filterObj['date'] = {
          $gte: current.toISOString(),
          $lt: tomorrow.toISOString(),
        };
      }
      if (currentUser) {
        filterObj['customerId'] = userId ? userId : '';
      }
      if (user) {
        filterObj['customerId'] = user;
      }
      if (date) {
        filterObj['date'] = date;
      }
      if (fromNow) {
        const current = dayjs()
          .set('hour', 0)
          .set('minute', 0)
          .set('second', 0)
          .set('millisecond', 0);
        const tomorrow = current.add(1000, 'day');
        filterObj['date'] = {
          $gte: current.toISOString(),
          $lt: tomorrow.toISOString(),
        };
      }
      if (checkedIn) {
        filterObj['status'] = ReservationStatus.CHECKED_IN;
      }
      const result = await this.reservationModel
        .find(filterObj)
        .populate('tableId', '-reservations')
        .populate('customerId', 'fullname avatar')
        .lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new NotAcceptableException('This is not a valid id');

      const reservation = await this.reservationModel.findById(id).lean();
      // TODO Handle case product null;
      if (reservation) {
        return transformResult(reservation);
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  async noValidateCreate(createReservationData: CreateReservationDto) {
    try {
      const newReservation = new this.reservationModel(createReservationData);
      return (await newReservation.save()).toObject();
    } catch (error) {
      throw error;
    }
  }
  async create(createReservationData: CreateReservationDto) {
    try {
      // Need to check for table id and user id valid or not
      const checkingTable = await this.tableService.findOriginalById(
        createReservationData.tableId,
      );
      const user = await this.userService.findById(
        createReservationData.customerId,
      );

      if (!checkingTable) {
        throw new HttpException('No available table!', HttpStatus.NOT_FOUND);
      }
      if (!user) {
        throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
      }
      if (dayjs(createReservationData.date).isBefore(dayjs())) {
        throw new BadRequestException('Can not make a reservation in the pass');
      }
      let createdReservation;
      let reservations: mongoose.LeanDocument<Reservation>[];
      let isAvailable = false;
      if (_.isEmpty(checkingTable.reservations)) {
        createdReservation = await this.noValidateCreate(createReservationData);
        isAvailable = true;
        console.log('Empty');
        reservations = [...checkingTable.reservations, createdReservation];
      }
      // Smaller than
      else if (
        dayjs(createReservationData.date).diff(
          dayjs(checkingTable.reservations[0].date),
          'second',
        ) <
        -1 * GAP_BETWEEN_RESERVATIONS
      ) {
        console.log(
          `${createReservationData.date} smaller than ${checkingTable.reservations[0].date}`,
        );
        createdReservation = await this.noValidateCreate(createReservationData);
        isAvailable = true;
        reservations = [createdReservation, ...checkingTable.reservations];
      }
      // Greater than
      else if (
        dayjs(createReservationData.date).diff(
          dayjs(
            checkingTable.reservations[checkingTable.reservations.length - 1]
              .date,
          ),
          'second',
        ) > GAP_BETWEEN_RESERVATIONS
      ) {
        console.error(
          `${createReservationData.date} is greater than ${
            checkingTable.reservations[checkingTable.reservations.length - 1]
              .date
          }`,
        );
        createdReservation = await this.noValidateCreate(createReservationData);
        isAvailable = true;
        reservations = [...checkingTable.reservations, createdReservation];
      }
      // Between
      else {
        for (let idx = 0; idx < checkingTable.reservations.length - 1; idx++) {
          if (
            dayjs(checkingTable.reservations[idx].date).diff(
              dayjs(createReservationData.date),
              'second',
            ) <=
              -1 * GAP_BETWEEN_RESERVATIONS &&
            dayjs(checkingTable.reservations[idx + 1].date).diff(
              dayjs(createReservationData.date),
              'second',
            ) >= GAP_BETWEEN_RESERVATIONS
          ) {
            console.log(
              `${createReservationData.date} is between ${
                checkingTable.reservations[idx].date
              } and ${checkingTable.reservations[idx + 1].date}`,
            );
            createdReservation = await this.noValidateCreate(
              createReservationData,
            );
            isAvailable = true;
            reservations = [...checkingTable.reservations];
            reservations.splice(idx + 1, 0, createdReservation as any);
          }
        }
      }
      if (isAvailable) {
        const updated = await this.tableService.update(
          createReservationData.tableId,
          {
            reservations: reservations as any,
          },
        );
        if (updated) {
          return transformResult(createdReservation);
        }
      }
      throw new HttpException(
        'Can not make new reservation because this table was busy',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, updateReservationData: UpdateReservationDto) {
    try {
      const updated = await this.reservationModel
        .findByIdAndUpdate(id, updateReservationData, { runValidators: true })
        .lean();
      return transformResult(updated);
    } catch (error) {
      throw error;
    }
  }
  async updateByUser(
    id: string,
    updateReservationData: UpdateReservationDto,
    user: any,
  ) {
    if (user.role !== Role.USER) {
      throw new ForbiddenException('This use can not access');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    try {
      const reserve = await this.reservationModel.findById(id).lean();
      const currentTime = dayjs();
      if (
        currentTime.diff(reserve.date, 'hour') < MILESTONE_CANCEL_RESERVATION
      ) {
        throw new BadRequestException(
          'Can not cancel this reservation due to policy',
        );
      }

      const updated = await this.reservationModel
        .findByIdAndUpdate(id, updateReservationData, { runValidators: true })
        .lean();
      return transformResult(updated);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string, tableId: string) {
    try {
      const deleted = await this.tableService.deleteReservationById(
        tableId,
        id,
      );
      if (deleted) {
        const deletedReservation = await this.reservationModel
          .findByIdAndDelete(id)
          .lean();
        return transformResult(deletedReservation);
      }
      throw new HttpException(
        'Some thing went wrong while delete reservation',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw error;
    }
  }

  async countReservations(): Promise<number> {
    try {
      let today = new Date();
      const start = new Date(
        today.setDate(today.getDate() - today.getDay() - 6),
      ).getTime();
      today = new Date();
      const end = new Date(
        today.setDate(today.getDate() - today.getDay()),
      ).getTime();
      const reservations = await this.findByFilter();

      const filterResevations = reservations.filter(
        (item) =>
          new Date(item.date).getTime() >= start &&
          new Date(item.date).getTime() <= end,
      );
      return filterResevations.length;
    } catch (error) {
      throw error;
    }
  }
}
