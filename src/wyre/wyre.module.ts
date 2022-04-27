import { Module } from '@nestjs/common';
import { WyreService } from './wyre.service';
import { WyreController } from './wyre.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  controllers: [WyreController],
  providers: [WyreService],
})
export class WyreModule {}
