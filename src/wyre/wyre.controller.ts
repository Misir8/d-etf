import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WyreService } from './wyre.service';

@Controller('wyre')
export class WyreController {
  constructor(private readonly wyreService: WyreService) {}

  @Get('/url')
  getUrlReservation() {
    return this.wyreService.sendRequestToWyre();
  }

  @Post('/webhook')
  wyreSuccessHandle(@Body() body) {
    console.log(body, 'query');
    return body;
  }

  @Get('/webhook')
  wyreFailHandle(@Query() query) {
    console.log(query, 'query');
    return 'success';
  }

  @Get('/transfer')
  getTransfer() {
    return this.wyreService.getTransfer();
  }
}
