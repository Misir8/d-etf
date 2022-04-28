import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

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
    };

    const res = await lastValueFrom(
      this.httpService.post(
        'https://api.testwyre.com/v2/digitalwallet/webhook',
        {},
        {
          params: {
            owner: 'account:' + data.referrerAccountId,
            webhook: process.env.BASE_URL + 'wyre/webhook',
          },
          headers: {
            Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
          },
        },
      ),
    );

    console.log(res.data);

    const response = await lastValueFrom(
      this.httpService.post(this.wyreUrl.toString() + 'orders/reserve', data, {
        headers: {
          Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
        },
      }),
    );
    return response.data;
  }

  async getTransfer() {
    const response = await lastValueFrom(
      this.httpService.get(process.env.TRANSFER_URL, {
        headers: {
          Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
        },
      }),
    );
    return response.data;
  }
}
