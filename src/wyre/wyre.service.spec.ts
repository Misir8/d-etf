import { Test, TestingModule } from '@nestjs/testing';
import { WyreService } from './wyre.service';

describe('WyreService', () => {
  let service: WyreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WyreService],
    }).compile();

    service = module.get<WyreService>(WyreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
