import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { GetUser } from './get-user.decorator';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../shared/response.dto';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { User } from '../entity/User';

@ApiTags('api/users')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signUp')
  @ApiOperation({ summary: 'sign up' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDto,
    description: 'user sign up',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'something went wrong',
  })
  signUp(@GetUser() user, @Body(ValidationPipe) authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }

  @Post('/signIn')
  @ApiOperation({ summary: 'sign in' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenResponseDto,
    description: 'user sign in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'invalid credentials',
  })
  signIn(
    @Body(ValidationPipe) authSignInDto: AuthSignInDto,
  ): Promise<AccessTokenResponseDto> {
    return this.authService.signIn(authSignInDto);
  }

  @Post('/sendForgotEmail')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDto,
    description: 'send email forgot password',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dont exist' })
  resetPassword(@Body('email') email: string): Promise<ResponseDto> {
    return this.authService.sendEmailForgotPassword(email);
  }

  @Post('/checkToken')
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenResponseDto,
    description: 'check token',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dont exist' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'invalid token' })
  checkToken(
    @Body() checkTokenDto: CheckTokenDto,
  ): Promise<AccessTokenResponseDto> {
    return this.authService.checkToken(checkTokenDto);
  }

  @Post('/setNewPassword')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDto,
    description: 'set new password',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dont exist' })
  setNewPassword(
    @Body() setNewPasswordDto: SetNewPasswordDto,
  ): Promise<ResponseDto> {
    return this.authService.setPassword(setNewPasswordDto);
  }

  @Get('/users')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'get user list',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dont exist' })
  getUsers(@Body() getUsersDto: GetUsersDto): Promise<User[]> {
    return this.authService.getUsers(getUsersDto);
  }
}
