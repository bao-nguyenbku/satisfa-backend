import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post('create')
  createOrder(@Body() createOrderData: any) {
    return this.orderService.test(createOrderData);
  }
}
