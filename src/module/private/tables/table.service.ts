import {
  Injectable,
  NotAcceptableException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTableDto } from './dto/create-table.dto';
import mongoose from 'mongoose';
import {
  Table,
  TableDocument,
  TableStatus,
} from '~/module/private/tables/table.schema';
import { UpdateTableDto } from './dto/update-table.dto';
import { transformResult } from '~/utils';
import * as _ from 'lodash';

export type TableFilter = {
  status: string;
  minSeat: number;
};
@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAll(): Promise<Table[]> {
    try {
      const tableList = await this.tableModel.find().lean();
      return tableList.map((table) => {
        const { _id, __v, ...rest } = table;
        return {
          id: _id,
          ...rest,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  async findAllByFilter(filter: TableFilter): Promise<Table[]> {
    const { status, minSeat } = filter;
    try {
      if (_.isEmpty(filter)) {
        const result = await this.tableModel.find().lean();
        return transformResult(result);
      }
      if (Object.values(TableStatus).includes(TableStatus[status]) === false) {
        throw new HttpException(
          `${status} is not a valid status`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const result = await this.tableModel
        .find({
          status,
          numberOfSeat: {
            $gt: minSeat,
          },
        })
        .lean();
      if (result) {
        return transformResult(result);
      }
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const existedTable = await this.tableModel.findById(id).lean();
        if (existedTable) {
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

  async create(createTableData: CreateTableDto) {
    try {
      const tableData = new this.tableModel(createTableData);
      return tableData.save();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTableData: UpdateTableDto) {
    try {
      console.log(id);
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

  async delete(id: string): Promise<Table> {
    try {
      return this.tableModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw error;
    }
  }
}
