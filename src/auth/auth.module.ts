import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entity/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordToken } from '../entity/PasswordToken';
import { MailerModule } from '@nestjs-modules/mailer';
import { Role } from '../entity/Role';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([User, PasswordToken, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
