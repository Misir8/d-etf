import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Types {
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
    default: Types.BUY,
  })
  type: Types;

  @CreateDateColumn()
  purchaseDate: Date;
}
