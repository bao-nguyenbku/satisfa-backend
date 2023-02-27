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
import { CreateReservationDto } from './dto/create-reserve.dto';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { UpdateReservationDto } from './dto/update-reserve.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async getAllReservation() {
    return await this.reservationService.findAll();
  }

  @Get('/:id')
  @UseFilters(MongoExceptionFilter)
  async getTableById(@Param('id') id: string) {
    return await this.reservationService.findById(id);
  }

  @Post('/create')
  async createReservation(@Body() createReservationData: CreateReservationDto) {
    return await this.reservationService.create(createReservationData);
  }

  @Patch('/:id')
  async updateTable(
    @Param('id') id: string,
    @Body() updateReservationData: UpdateReservationDto,
  ) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(this.reservationService.update(id, updateReservationData));
      }, 2000);
    });
    // return this.productService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.reservationService.delete(id);
  }
}
