import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthcheck')
  async checkServer() {
    return 'Server is running';
  }
}
