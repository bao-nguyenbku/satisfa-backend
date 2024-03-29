import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableService, TableFilter } from './table.service';
// import { TableStatus } from './table.schema';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get(':id')
  @UseFilters(MongoExceptionFilter)
  async getTableById(@Param('id') id: string, @Query() filter: TableFilter) {
    return this.tableService.findById(id, filter);
  }

  @Get()
  @UseFilters(MongoExceptionFilter)
  async getTableByFilter(@Query() filter: TableFilter) {
    return this.tableService.findAllByFilter(filter);
  }

  @Post('create')
  async createTable(@Body() createTableData: CreateTableDto) {
    return this.tableService.create(createTableData);
  }

  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateTableData: UpdateTableDto,
  ): Promise<any> {
    return this.tableService.update(id, updateTableData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.tableService.delete(id);
  }
}
