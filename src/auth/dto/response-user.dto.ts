import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phoneNumber: string;
}
