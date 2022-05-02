import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

export enum TransactionType {
  BUY = 'BUY',
  SEL = 'SEL',
}

@Entity({
  name: 'transactions',
})
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: TransactionType.BUY,
  })
  type: TransactionType;

  @Column()
  amountUSDT: number;

  @Column()
  amountDETF: number;

  @CreateDateColumn()
  purchaseDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
