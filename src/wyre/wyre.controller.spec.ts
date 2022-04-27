import { Test, TestingModule } from '@nestjs/testing';
import { WyreController } from './wyre.controller';
import { WyreService } from './wyre.service';

describe('WyreController', () => {
  let controller: WyreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WyreController],
      providers: [WyreService],
    }).compile();

    controller = module.get<WyreController>(WyreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
