import {
  Injectable,
  NotAcceptableException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reserve.dto';
import mongoose from 'mongoose';
import {
  Reservation,
  ReservationFilter,
  ReservatonDocument,
} from '~/module/private/reservations/reservation.schema';
import { UpdateReservationDto } from './dto/update-reserve.dto';
import { TableService } from '../tables/table.service';
import { UsersService } from '~/module/common/users/user.service';
import { transformResult } from '~/utils';
import { GAP_BETWEEN_RESERVATIONS } from '~/constants';
// import { TableStatus } from '../tables/table.schema';
// import { ReservationEntity } from './entities/reservation.entity';
// import duration from 'dayjs/plugin/duration';
import * as dayjs from 'dayjs';

Injectable();
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservatonDocument>,
    private readonly tableService: TableService,
    private readonly userService: UsersService,
  ) {}
  async findByFilter(filter: ReservationFilter) {
    try {
      if (_.isEmpty(filter)) {
        const result = await this.reservationModel
          .find()
          .populate('tableId')
          .populate('customerId', 'fullname')
          .lean();
        return transformResult(result);
      }
      const { date } = filter;
      const result = await this.reservationModel.find({ date }).lean();
      return transformResult(result);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const reservation = await this.reservationModel.findById(id).lean();
        // TODO Handle case product null;
        if (reservation) {
          const { _id, __v, ...rest } = reservation;
          return {
            id: _id,
            ...rest,
          };
        }
        return null;
      } else {
        throw new NotAcceptableException('This is not a valid id');
      }
    } catch (error) {
      throw error;
    }
  }
  async noValidateCreate(createReservationData: CreateReservationDto) {
    try {
      const newReservation = new this.reservationModel(createReservationData);
      return newReservation.save();
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
      let reservations: mongoose.LeanDocument<Reservation>[];
      let isAvailable = false;
      if (_.isEmpty(checkingTable.reservations)) {
        const createdReservation = await this.noValidateCreate(
          createReservationData,
        );
        isAvailable = true;
        console.log('Empty');
        reservations = [...checkingTable.reservations, createdReservation];
      }
      if (
        dayjs(createReservationData.date).diff(
          dayjs(checkingTable.reservations[0].date),
          'second',
        ) <= GAP_BETWEEN_RESERVATIONS
      ) {
        console.log('Smaller than');
        const createdReservation = await this.noValidateCreate(
          createReservationData,
        );
        isAvailable = true;
        reservations = [createdReservation, ...checkingTable.reservations];
      } else if (
        dayjs(createReservationData.date).diff(
          dayjs(
            checkingTable.reservations[checkingTable.reservations.length - 1]
              .date,
          ),
          'second',
        ) >= GAP_BETWEEN_RESERVATIONS
      ) {
        console.log('Greater than');
        const createdReservation = await this.noValidateCreate(
          createReservationData,
        );
        isAvailable = true;
        reservations = [...checkingTable.reservations, createdReservation];
      } else {
        for (let idx = 0; idx < checkingTable.reservations.length - 1; idx++) {
          if (
            dayjs(checkingTable.reservations[idx].date).diff(
              dayjs(createReservationData.date),
              'second',
            ) < GAP_BETWEEN_RESERVATIONS &&
            dayjs(checkingTable.reservations[idx + 1].date).diff(
              dayjs(createReservationData.date),
              'second',
            ) > GAP_BETWEEN_RESERVATIONS
          ) {
            console.log('Between');
            isAvailable = true;
            reservations = [...checkingTable.reservations];
            reservations.splice(idx + 1, 0, createReservationData as any);
          }
        }
      }
      if (isAvailable) {
        return this.tableService.update(createReservationData.tableId, {
          reservations: reservations as any,
        });
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
      const updated = await this.reservationModel.updateOne(
        { _id: id },
        updateReservationData,
        { runValidators: true },
      );
      return updated;
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
}
