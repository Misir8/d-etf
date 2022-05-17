import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Transaction } from './Transaction';
import { Role } from './Role';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  phoneNumber: string;

  @IsEmail()
  @Column({
    nullable: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @CreateDateColumn()
  resetPasswordExpire: Date;

  @Column({ default: 0 })
  balance: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @RelationId((user: User) => user.role)
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
  })
  role: Role;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async getResetPasswordToken() {
    const resetToken = await bcrypt.randomBytes(20).toString('hex');
    this.resetPasswordToken = bcrypt
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    //this.resetPasswordExpire = Date.now();
    return resetToken;
  }
}
