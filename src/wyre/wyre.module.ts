import { Module } from '@nestjs/common';
import { WyreService } from './wyre.service';
import { WyreController } from './wyre.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Rate } from '../entity/Rate';
import { Transaction } from '../entity/Transaction';

@Module({
  imports: [
    HttpModule.register({}),
    TypeOrmModule.forFeature([User, Rate, Transaction]),
  ],
  controllers: [WyreController],
  providers: [WyreService],
})
export class WyreModule {}
