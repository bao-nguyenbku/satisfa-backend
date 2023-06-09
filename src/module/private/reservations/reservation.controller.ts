import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  Request,
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
import { ReservationFilter } from './dto/query-reserve.dto';
import { JwtAuthGuard } from '~/module/common/auth/guards/access-auth.guard';
// import { Roles } from '~/module/common/auth/roles.decorator';
// import { Role } from '~/constants/role.enum';
// import { RolesGuard } from '~/module/common/auth/guards/roles.guard';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseFilters(MongoExceptionFilter)
  @UseGuards(JwtAuthGuard)
  async getAllReservationByFilter(
    @Query() filter: ReservationFilter,
    @Request() req,
  ) {
    return this.reservationService.findByFilter(filter, req.user.id);
  }

  @Get(':id')
  @UseFilters(MongoExceptionFilter)
  async getReservationById(@Param('id') id: string) {
    return await this.reservationService.findById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async createReservation(@Body() createReservationData: CreateReservationDto) {
    return this.reservationService.create(createReservationData);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async updateReservationByAdmin(
    @Param('id') id: string,
    @Body() updateReservationData: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationData);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async updateReservation(
    @Param('id') id: string,
    @Body() updateReservationData: UpdateReservationDto,
    @Request() req,
  ) {
    return this.reservationService.updateByUser(
      id,
      updateReservationData,
      req.user,
    );
  }

  @Delete(':id/:tableId')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  async deleteReservationById(
    @Param('id') id: string,
    @Param('tableId') tableId: string,
  ) {
    return this.reservationService.delete(id, tableId);
  }
}
