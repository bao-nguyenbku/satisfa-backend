import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableService } from './table.service';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  async getAllTable() {
    return this.tableService.findAll();
  }

  @Get(':id')
  @UseFilters(MongoExceptionFilter)
  async getTableById(@Param('id') id: string) {
    return this.tableService.findById(id);
  }

  @Post('create')
  async createTable(@Body() createTableData: CreateTableDto) {
    return this.tableService.create(createTableData);
  }

  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateTableData: UpdateTableDto,
  ) {
    return this.tableService.update(id, updateTableData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.tableService.delete(id);
  }
}
