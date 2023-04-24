import { Body, Controller, Post } from '@nestjs/common';
import { MomoService } from './momo.service';
import { CreateMomoData } from './momo-interface';
// import { MongoExceptionFilter } from '~/utils/mongo.filter';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Post('/')
  async createMomo(@Body() createMomoData: CreateMomoData) {
    return this.momoService.create(createMomoData);
  }
}
