import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  async getAllOrder() {
    return this.orderService.findAll();
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  async createOrder(@Body() createOrderData: any) {
    return this.orderService.create(createOrderData);
  }
}
