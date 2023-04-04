import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/query-order.dto';
import { PaidOrderDto } from './dto/paid-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async getAllOrder(@Query() filter: OrderFilterDto) {
    return this.orderService.findByFilter(filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async getOrderById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateData);
  }

  @Patch(':id/paid')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async paidOrder(@Param('id') id: string, @Body() paymentData: PaidOrderDto) {
    console.log(
      '🚀 ~ file: orders.controller.ts:58 ~ OrdersController ~ paidOrder ~ paymentData:',
      paymentData,
    );
    return this.orderService.paid(id, paymentData);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async createOrder(@Body() createOrderData: CreateOrderDto) {
    return this.orderService.create(createOrderData);
  }
}
