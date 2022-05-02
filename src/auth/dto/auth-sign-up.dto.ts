import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  password: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}
