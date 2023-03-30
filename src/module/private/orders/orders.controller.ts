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
import { OrderStatus } from './order.schema';
import { OrderFilter } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  async getAllOrder(@Query() filter: OrderFilter) {
    return this.orderService.findByFilter(filter);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateData);
  }
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async createOrder(@Body() createOrderData: CreateOrderDto) {
    return this.orderService.create(createOrderData);
  }
}
