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
