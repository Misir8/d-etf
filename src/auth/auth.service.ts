import {
  BadRequestException,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

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
}
