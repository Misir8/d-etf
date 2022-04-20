import { Module } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Module({})
export class UtilsModule {
  providers: [AuthService];
}
