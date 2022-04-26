import { IsNotEmpty, IsString } from 'class-validator';

export class SetNewPasswordDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
