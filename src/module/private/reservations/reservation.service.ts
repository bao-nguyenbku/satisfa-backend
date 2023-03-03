import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservationDto } from './dto/create-reserve.dto';
import mongoose from 'mongoose';
import {
  Reservation,
  ReservatonDocument,
} from '~/module/private/reservations/reservation.schema';
import { UpdateReservationDto } from './dto/update-reserve.dto';

Injectable();
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservatonDocument>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return await this.reservationModel.find().exec();
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
    try {
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
