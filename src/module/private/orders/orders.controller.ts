import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  UseFilters,
  UseGuards,
  Param,
  Patch,
  Query,
  UsePipes,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/query-order.dto';
import { PaidOrderDto } from './dto/paid-order.dto';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @UseFilters(MongoExceptionFilter)
  async getAllOrder(@Query() filter: OrderFilterDto) {
    return this.orderService.findByFilter(filter);
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.USER)
  @UseFilters(MongoExceptionFilter)
  async getAllOrderByCurrentUser(
    @Query() filter: OrderFilterDto,
    @Request() req,
  ) {
    return this.orderService.findByFilter(
      {
        ...filter,
        currentUser: true,
      },
      req.user.id,
    );
  }

  @Get('lastest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(Role.USER)
  @UseFilters(MongoExceptionFilter)
  async getLastestOrder(@Query() filter: OrderFilterDto, @Request() req) {
    return this.orderService.findByFilter(
      {
        ...filter,
        currentUser: true,
        lastest: true,
      },
      req.user.id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async getOrderById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async deleteOrderById(@Param('id') id: string) {
    return id;
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async paidOrder(@Param('id') id: string, @Body() paymentData: PaidOrderDto) {
    return this.orderService.paid(id, paymentData);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async createOrder(@Body() createOrderData: CreateOrderDto) {
    return this.orderService.create(createOrderData);
  }

  @Post('create-guest')
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async createOrderByGuest(@Body() createOrderData: CreateOrderDto) {
    return this.orderService.create(createOrderData);
  }
  // ANALYSIS
  @Get('count')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async getOrderAmount() {
    return this.orderService.getOrderAmount();
  }

  @Get('/bestseller')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async getBestSeller(@Query() filter: number) {
    return this.orderService.getBestSeller(filter);
  }
}
