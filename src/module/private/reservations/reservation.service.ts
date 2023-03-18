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
import { TableStatus } from '../tables/table.schema';

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

  async create(createReservationData: CreateReservationDto) {
    // need to check for table id and user id valid or not
    const table = await this.tableService.findById(
      createReservationData.tableId,
    );
    const user = await this.userService.findById(
      createReservationData.customerId,
    );

    try {
      if (!table) {
        throw new HttpException('No available table!', HttpStatus.NOT_FOUND);
      }
      if (!user) {
        throw new HttpException('User do not exist!', HttpStatus.NOT_FOUND);
      }
      if (table.status != TableStatus.FREE) {
        throw new HttpException(
          'Table has been reserved already',
          HttpStatus.NOT_FOUND,
        );
      }
      const reservationData = new this.reservationModel(createReservationData);
      return reservationData.save();
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

  async delete(id: string): Promise<Reservation> {
    return await this.reservationModel.findByIdAndDelete(id).exec();
  }
}
