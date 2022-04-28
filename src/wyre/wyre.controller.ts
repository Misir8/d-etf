import { Controller, Get } from '@nestjs/common';
import { WyreService } from './wyre.service';

@Controller('wyre')
export class WyreController {
  constructor(private readonly wyreService: WyreService) {}

  @Get('/url')
  getUrlReservation() {
    return this.wyreService.sendRequestToWyre();
  }

  @Get('/transfer')
  getTransfer() {
    return this.wyreService.getTransfer();
  }
}
