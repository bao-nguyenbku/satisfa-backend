import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTableDto } from './dto/create-table.dto';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { Table, TableDocument } from '~/module/private/tables/table.schema';
import { UpdateTableDto } from './dto/update-table.dto';
import { transformResult } from '~/utils';
import { CreateReservationDto } from '../reservations/dto/create-reserve.dto';

export type TableFilter = {
  reservationDate?: string;
  minSeat?: number;
};
@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAllByFilter(filter: TableFilter): Promise<Table[]> {
    const { minSeat, reservationDate } = filter;
    let filterObj = {};
    try {
      if (!_.isEmpty(minSeat)) {
        filterObj = {
          numberOfSeats: {
            $gte: minSeat,
          },
        };
      }
      const result = await this.tableModel
        .find(filterObj)
        .populate({
          path: 'reservations',
          populate: {
            path: 'customerId',
            select: '-password -role',
          },
          select: '-tableId',
        })
        .lean();
      if (result) {
        let filterResult = [...result];
        if (reservationDate) {
          filterResult = result.map((table) => {
            const filterReservation = table.reservations.filter(
              (ele) => dayjs(ele.date).diff(dayjs(reservationDate)) >= 0,
            );
            return {
              ...table,
              reservations: filterReservation,
            };
          });
        }
        return transformResult(filterResult);
      }
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string, filter: TableFilter) {
    const { reservationDate } = filter;
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const existedTable = await this.tableModel
          .findById(id)
          .populate({
            path: 'reservations',
            populate: {
              path: 'customerId',
              select: '-password -role',
            },
            select: '-tableId',
          })
          .lean();
        if (existedTable) {
          const filterdReservation = existedTable.reservations.filter((ele) => {
            return dayjs(ele.date).diff(dayjs(reservationDate)) >= 0;
          });
          existedTable.reservations = filterdReservation;
          return transformResult(existedTable);
        }
        return null;
      } else {
        throw new NotAcceptableException('This is not a valid table id');
      }
    } catch (error) {
      throw error;
    }
  }
  async findOriginalById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return this.tableModel.findById(id).populate('reservations').lean();
      } else {
        throw new NotAcceptableException('This is not a valid table id');
      }
    } catch (error) {
      throw error;
    }
  }

  async create(createTableData: CreateTableDto) {
    try {
      const tableData = new this.tableModel(createTableData);
      return transformResult((await tableData.save()).toObject());
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTableData: UpdateTableDto) {
    try {
      const updated = await this.tableModel.updateOne(
        { _id: id },
        updateTableData,
        { runValidators: true },
      );
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async updateTableReservations(
    id: string,
    reservations: CreateReservationDto[],
  ) {
    try {
      const updated = await this.tableModel.updateOne(
        { _id: id },
        { reservations: reservations },
        { runValidators: true },
      );
      return updated;
    } catch (error) {
      throw error;
    }
  }
  async deleteReservationById(tableId: string, reservationId: string) {
    try {
      const existedTable = await this.tableModel
        .findById(tableId)
        .populate({
          path: 'reservations',
        })
        .lean();
      if (!existedTable) {
        return;
      }

      const cloneReservations = [...existedTable.reservations];
      const idx = cloneReservations.findIndex(
        (reserved) => reserved._id.toString() === reservationId,
      );
      if (idx !== -1) {
        cloneReservations.splice(idx, 1);
        return this.tableModel.findByIdAndUpdate(tableId, {
          reservations: cloneReservations,
        });
      }

      return null;
    } catch (error) {
      const jsonError = error?.toJSON();
      if (jsonError.path === '_id' && jsonError.kind === 'ObjectId') {
        throw new BadRequestException('Invalid table id');
      }
      throw error;
    }
  }
  async delete(id: string): Promise<Table> {
    try {
      const response = await this.tableModel.findOneAndDelete(
        {
          _id: id,
        },
        {
          $where: 'this.reservations.length === 0',
        },
      );
      if (!response) {
        throw new NotAcceptableException(
          'This table is currently in reservation',
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
