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
    const response = await lastValueFrom(
      this.httpService.post(
        this.wyreUrl.toString() +
          '?referrerAccountId=' +
          `${process.env.ACCOUNT_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
        },
      ),
    );
    return response.data;
  }
  async getTransfer() {
    const response = await lastValueFrom(
      this.httpService.get(process.env.TRANSFER_URL, {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      }),
    );
    return response.data;
  }
}
