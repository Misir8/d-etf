export interface OrderWebHook {
  referenceId: any;
  accountId: string;
  orderId: string;
  orderStatus: OrderStatus;
  transferId: string;
  failedReason: any;
  error: any;
  reservation: string;
  email: string;
}

export enum OrderStatus {
  COMPLETE = 'COMPLETE',
  PROCESSING = 'PROCESSING',
}
export interface Transfer {
  sourceName: string;
  destName: string;
  sourceAmount: number;
  destAmount: number;
  status: OrderStatus;
  message: string;
  transferId: string;
  sourceCurrency: string;
  destCurrency:string;
  exchangeRate:number;
  type:String
}
