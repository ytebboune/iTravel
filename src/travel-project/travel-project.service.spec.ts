import { Test, TestingModule } from '@nestjs/testing';
import { TravelProjectService } from './travel-project.service';

describe('TravelProjectService', () => {
  let service: TravelProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelProjectService],
    }).compile();

    service = module.get<TravelProjectService>(TravelProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
