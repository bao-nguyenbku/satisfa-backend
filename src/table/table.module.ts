import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from '../schemas/table.schema';
import { TableController } from './table.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
  ],
  providers: [TableService],
  controllers: [TableController],
})
export class TableModule {}