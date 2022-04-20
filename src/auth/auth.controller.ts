import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //signup
@Post("/signUp")
signUp(@Body(ValidationPipe)authCredentialsDto:AuthCredentialsDto):Promise<void>{
     return this.authService.signUp(authCredentialsDto);
 }


//signin
@Post("/signIn")
 signIn(@Body(ValidationPipe)authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
     return this.authService.signIn(authCredentialsDto);
 }
}
