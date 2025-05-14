import { Test, TestingModule } from '@nestjs/testing';
import { TravelProjectController } from './travel-project.controller';

describe('TravelProjectController', () => {
  let controller: TravelProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelProjectController],
    }).compile();

    controller = module.get<TravelProjectController>(TravelProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
