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

  @Column('decimal', { precision: 5, scale: 2 })
  amountUSDT: number;

  @Column('decimal', { precision: 5, scale: 2 })
  amountDETF: number;

  @CreateDateColumn()
  purchaseDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
