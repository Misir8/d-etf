import { Body, Controller, Get, Post } from '@nestjs/common';
import { WyreService } from './wyre.service';

@Controller('wyre')
export class WyreController {
  constructor(private readonly wyreService: WyreService) {}

  @Get('/url')
  getUrlReservation() {
    return this.wyreService.sendRequestToWyre();
  }

  @Post('/webhook')
  async wyreSuccessHandle(@Body() body) {
    await this.wyreService.handleWebhook(body);
    return 'Success';
  }
}
