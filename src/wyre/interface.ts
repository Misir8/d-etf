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
  pusherChannel: string;
  exchangeRate: number;
  sourceCurrency: string /* USD */;
  destCurrency: string /* USDT */;
  destAmount: number;
  createdAt: number;
  sourceAmount: number;
  dest: string;
  fees: {
    USDT: number;
    USD: number;
  };
  totalFees: number;
  customId?: any | null;
  completedAt: number;
  cancelledAt: any | null;
  failureReason: any | null;
  blockchainTx: any | null;
  expiresAt: number;
  updatedAt: number;
  estimatedArrival: number;
  reversingSubStatus: any | null;
  reversalReason: any | null;
  pendingSubStatus: any | null;
  statusHistories: StatusHistory[];
  message: any | null;
  id: string;
  owner: string;
  source: string;
  status: string;
}

interface StatusHistory {
  id: string;
  transferId: string;
  createdAt: number;
  type: string;
  statusOrder: number;
  statusDetail: StatusDetail;
  state: State;
  failedState: null;
}

enum StatusDetail {
  COMPLETED = 'Transfer Completed',
  DEPOSIT = 'Processing Deposit',
  EXCHANGE = 'Processing Exchange',
  INITIAL = 'Initiating Transfer',
}

enum State {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  INITIATED = 'INITIATED',
}
