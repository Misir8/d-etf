import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OrderStatus, OrderWebHook, Transfer } from './interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Transaction, TransactionType } from '../entity/Transaction';
import { Rate } from '../entity/Rate';

@Injectable()
export class WyreService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Rate) private readonly rateRepo: Repository<Rate>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}
  private wyrErl: URL;

  private get wyreUrl() {
    this.wyrErl = new URL(process.env.WYRE_URL);
    return this.wyrErl;
  }

  public async sendRequestToWyre(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        `User with id ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const data = {
      referrerAccountId: process.env.WYRE_ACCOUNT_ID,
      destCurrency: 'USDT',
      dest: 'ethereum:' + process.env.WYRE_ETH_WALLET,
      lockFields: ['dest', 'destCurrency', 'email'],
      amount: 10,
      email: user.email,
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
      console.log(e);
      throw new HttpException('Request error', HttpStatus.BAD_REQUEST);
    }
  }

  async handleWebhook(orderWebHook: OrderWebHook) {
    if (orderWebHook.orderStatus === OrderStatus.COMPLETE) {
      let response;
      try {
        response = await lastValueFrom(
          this.httpService.get(
            this.wyreUrl.toString() + 'transfers/' + orderWebHook.transferId,
            {
              headers: {
                Authorization: `Bearer ${process.env.WYRE_SECRET_KEY}`,
              },
            },
          ),
        );
      } catch (e) {
        console.log(e.message);
        return;
      }

      const user = await this.userRepo.findOne({
        where: { email: orderWebHook.email },
      });
      if (!user) {
        console.log('User with email ' + orderWebHook.email + ' not found');
        return;
      }

      const transfer: Transfer = response.data;

      if (transfer.destCurrency === 'USDT') {
        const rate = await this.rateRepo.findOne({ where: { isActive: true } });
        const transaction = new Transaction();
        transaction.userId = user.id;
        transaction.type = TransactionType.BUY;
        transaction.amountUSDT = transfer.destAmount;
        transaction.purchaseDate = new Date(transfer.completedAt);
        transaction.amountDETF = transfer.destAmount / rate.buyRate;

        const saveTransaction = this.transactionRepo.save(transaction);
        user.balance = Number(user.balance + transaction.amountDETF).toString();
        const saveUser = this.userRepo.save(user);

        await Promise.all([saveTransaction, saveUser]);
      }
    }
  }
}
