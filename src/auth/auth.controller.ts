import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { GetUser } from './get-user.decorator';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { GetUsersDto } from './dto/Get-Users.dto';

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

  @Post('/reset')
  resetPassword(@Body('email') email: string) {
    return this.authService.sendEmailForgotPassword(email);
  }

  @Post('/checkToken')
  checkToken(@Body() checkTokenDto: CheckTokenDto) {
    return this.authService.checkToken(checkTokenDto);
  }

  @Post('/setNewPassword')
  setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return this.authService.setPassword(setNewPasswordDto);
  }

  @Get('/users')
  getUsers(@Body() getUsersDto: GetUsersDto) {
    return this.authService.getUsers(getUsersDto);
  }
}
