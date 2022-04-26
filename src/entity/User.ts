import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

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

  async validatePassword(password: string): Promise<Boolean> {
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
