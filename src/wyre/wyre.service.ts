import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OrderStatus, OrderWebHook, Transfer } from "./interface";

@Injectable()
export class WyreService {
  constructor(private readonly httpService: HttpService) {}
  private wyrErl: URL;

  private get wyreUrl() {
    this.wyrErl = new URL(process.env.WYRE_URL);
    return this.wyrErl;
  }

  public async sendRequestToWyre() {
    const data = {
      referrerAccountId: process.env.WYRE_ACCOUNT_ID,
      destCurrency: 'USDT',
      dest: process.env.WYRE_ETH_WALLET,
      lockFields: ['dest', 'destCurrency'],
      amount: 10,
    };

    try {
      await lastValueFrom(
        this.httpService.post(
          'https://api.testwyre.com/v2/digitalwallet/webhook',
          {},
          {
            params: {
              owner: 'account:' + data.referrerAccountId,
              webhook: process.env.BASE_URL + '/wyre/webhook',
            },
            headers: {
              Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
            },
          },
        ),
      );

      const response = await lastValueFrom(
        this.httpService.post(
          this.wyreUrl.toString() + 'orders/reserve',
          data,
          {
            headers: {
              Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (e) {
      console.log(e.message);
      return { message: e.message, status: 'error' };
    }
  }

  async handleWebhook(orderWebHook: OrderWebHook) {
    if (orderWebHook.orderStatus === OrderStatus.COMPLETE) {
      const response = await lastValueFrom(
        this.httpService.get(
          this.wyreUrl.toString() + 'transfers/' + orderWebHook.transferId,
          {
            headers: {
              Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
            },
          },
        ),
      );
      //needs crete transfer interface type
      const transfers:Transfer[] = response.data;
      //handle business logic transaction success
    }
  }
}
