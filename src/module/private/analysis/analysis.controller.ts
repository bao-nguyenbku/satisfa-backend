import {
  Controller,
  Get,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { MongoExceptionFilter } from '~/utils/mongo.filter';
import { JwtAuthGuard } from '~/module/common/auth/guards/jwt-auth.guard';
import { Roles } from '~/module/common/auth/roles.decorator';
import { Role } from '~/constants/role.enum';
import { RolesGuard } from '~/module/common/auth/guards/roles.guard';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // ANALYSIS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  @Get('orders/count')
  async getOrderAmount() {
    return this.analysisService.getOrderAmount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  @Get('orders/revenue')
  async calculateRevenueFromOrder() {
    return this.analysisService.calculateRevenueFromOrder();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  @Get('users/count')
  async countCustomer() {
    return this.analysisService.countCustomer();
  }
}
