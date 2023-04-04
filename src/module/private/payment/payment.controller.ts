import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  @Post('create')
  async createPayment(@Body() createPaymentData: CreatePaymentDto) {
    return this.paymentService.create(createPaymentData);
  }
}
