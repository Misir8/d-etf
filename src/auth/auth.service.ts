import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private jwtService:JwtService
  ) {}
  //sign up
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await this.userRepo.save(user);
    } catch (error) {
      console.log(error);

    }
  }
  // validate password
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepo.findOne(username );
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
  //hashing password
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async findOne(username: string) {
    return await this.userRepo.findOne({ username });
  }
  async signIn(authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
    const username= await this.validateUserPassword(authCredentialsDto);
    if(!username){
        throw new UnauthorizedException("Invalid credentials");
    }
    const payload:JwtPayload={username};
    const accessToken= await this.jwtService.sign(payload);
    return {accessToken};
}
}
