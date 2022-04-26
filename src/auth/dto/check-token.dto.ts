import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
