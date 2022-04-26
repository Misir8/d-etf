import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { GetUser } from './get-user.decorator';
import { AuthSignInDto } from './dto/auth-sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //signup
  @Post('/signUp')
  @UseGuards()
  signUp(@GetUser() user, @Body(ValidationPipe) authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }

  //signin
  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) authSignInDto: AuthSignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSignInDto);
  }
}
