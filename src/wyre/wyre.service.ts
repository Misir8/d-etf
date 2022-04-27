import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WyreService {
  constructor(private readonly httpService: HttpService) {}
  private url: URL;

  private get wyreUrl() {
    this.url = new URL(process.env.WYRE_URL);
    return this.url;
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
}
