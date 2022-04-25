import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthSignInDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;
}
