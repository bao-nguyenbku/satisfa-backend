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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.schema';
import { OrderFilter } from './orders.service';

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
    console.log(id, updateData);
    return this.orderService.update(id, updateData);
  }
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseFilters(MongoExceptionFilter)
  async createOrder(@Body() createOrderData: any) {
    return this.orderService.create(createOrderData);
  }
}
