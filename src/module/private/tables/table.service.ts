import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTableDto } from './dto/create-table.dto';
import mongoose from 'mongoose';
import { Table, TableDocument } from '~/module/private/tables/table.schema';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async findAll(): Promise<Table[]> {
    return await this.tableModel.find().exec();
  }

  async findById(id: string) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const table = await this.tableModel.findById(id).lean();
        // TODO Handle case product null;
        if (table) {
          const { _id, __v, ...rest } = table;
          return {
            id: _id,
            ...rest,
          };
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
      console.log(id)
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
    return await this.tableModel.findByIdAndDelete(id).exec();
  }
}
