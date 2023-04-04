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
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reserve.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateReservationDto } from './dto/update-reserve.dto';
import { ReservationService } from './reservation.service';
import { TableService } from '../tables/table.service';
import { ReservationFilter } from './reservation.schema';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly tableService: TableService,
  ) {}

  @Get()
  @UseFilters(MongoExceptionFilter)
  async getAllReservationByFilter(@Query() filter: ReservationFilter) {
    return this.reservationService.findByFilter(filter);
  }

  @Get(':id')
  @UseFilters(MongoExceptionFilter)
  async getTableById(@Param('id') id: string) {
    return await this.reservationService.findById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async createReservation(@Body() createReservationData: CreateReservationDto) {
    return this.reservationService.create(createReservationData);
  }

  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateReservationData: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationData);
  }

  @Delete(':id/:tableId')
  async delete(@Param('id') id: string, @Param('tableId') tableId: string) {
    return this.reservationService.delete(id, tableId);
  }
}
