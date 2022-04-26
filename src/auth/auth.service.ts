import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { PasswordToken } from '../entity/PasswordToken';
import { MailerService } from '@nestjs-modules/mailer';
import { CheckTokenDto } from './dto/check-token.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PasswordToken)
    private readonly passwordTokenRepo: Repository<PasswordToken>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
  //sign up
  async signUp(authSignUpDto: AuthSignUpDto) {
    const { username, password, email, phoneNumber } = authSignUpDto;
    const dbUser = await this.userRepo
      .createQueryBuilder('user')
      .where(`user.username = '${username}'`)
      .getOne();
    if (dbUser) {
      throw new BadRequestException(`User with ${username} already exist`);
    }
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.phoneNumber = phoneNumber;
    try {
      await this.userRepo.save(user);
      return { message: 'User successfully added' };
    } catch (error) {
      console.log(error);
    }
  }
  // validate password
  async validateUserPassword(authSignInDto: AuthSignInDto): Promise<string> {
    const { username, password, email } = authSignInDto;
    if (username || email) {
      const user = await this.userRepo
        .createQueryBuilder('user')
        .where(`user.username = '${username}' OR user.email = '${email}'`)
        .getOne();
      if (user && (await user.validatePassword(password))) {
        return user.username;
      }
    } else {
      return null;
    }
  }
  //hashing password
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async findOne(username: string) {
    return await this.userRepo.findOne({ where: { username } });
  }
  async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authSignInDto);
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  //  async resetPassword(resetToken:string,password:string,){
  //   const resetPasswordToken = bcrypt
  //     .createHash('sha256')
  //     .update(resetToken)
  //     .digest('hex');
  //    const user = await this.userRepo
  //      .createQueryBuilder('user')
  //      .where('user.resetPasswordExpire > :resetPasswordExpire', {resetPasswordExpire: new Date()})
  //      .andWhere('user.resetPasswordToken = :resetPasswordToken', {resetPasswordToken})
  //      .getOne();
  //   user.password = password;
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;
  //   await this.userRepo.save(user);
  // };
  // async sendResendLink(email:string){
  //   const user = await this.userRepo.findOne({
  //     where: { email},
  //   });
  //   if(!user){
  //     throw new BadRequestException(`User with ${email} does not exist`);
  //   }
  //   const token = await this.generateToken(user);
  // }

  async sendEmailForgotPassword(email: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new BadRequestException(`User with ${email} does not exist`);
    }
    const passwordToken = await this.createForgottenPasswordToken(user);

    await this.sendResetPassword(email, passwordToken.token);
  }

  private async createForgottenPasswordToken(user: User) {
    const passTokenDb = await this.passwordTokenRepo
      .createQueryBuilder('passwordToken')
      .where('passwordToken.userId = :userId', { userId: user.id })
      .getOne();
    if (passTokenDb) {
      await this.passwordTokenRepo.remove(passTokenDb);
    }
    const passToken = new PasswordToken();
    passToken.token = (Math.random() + 1).toString(36).substring(7);
    passToken.createdAt = new Date();
    passToken.user = user;
    return await this.passwordTokenRepo.save(passToken);
  }
  async sendResetPassword(email: string, token: string) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_MAIL,
      subject: 'd-etf',
      // template: 'resetPassword',
      // context: {
      //   temporaryPassword,
      // },
      html: `<p>${token}</p>`,
    });
  }

  async checkToken(checkTemporaryPasswordDto: CheckTokenDto) {
    const { email, token } = checkTemporaryPasswordDto;
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    const passTokenDb = await this.passwordTokenRepo
      .createQueryBuilder('passwordToken')
      .where('passwordToken.userId = :userId', { userId: user.id })
      .andWhere('passwordToken.token = :token', { token })
      .getOne();
    if (!passTokenDb) {
      throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
    }
    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async setPassword(setNewPasswordDto: SetNewPasswordDto) {
    const { id, newPassword } = setNewPasswordDto;
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(newPassword, user.salt);
    await this.userRepo.save(user);
    return { message: `New password successfully set` };
  }
}
