import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class AuthSignInDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  @ApiProperty()
  email: string;
}
