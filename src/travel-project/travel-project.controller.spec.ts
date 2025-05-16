import { Test, TestingModule } from '@nestjs/testing';
import { TravelProjectController } from './travel-project.controller';
import { AuthService } from '../auth/auth.service';
import { TravelProjectService } from './travel-project.service';

describe('TravelProjectController', () => {
  let controller: TravelProjectController;

  const mockAuthService = {
    // Add any necessary mock methods for AuthService
  };

  const mockTravelProjectService = {
    // Add any necessary mock methods for TravelProjectService
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelProjectController],
      providers: [
        TravelProjectController,
        { provide: AuthService, useValue: mockAuthService },
        { provide: TravelProjectService, useValue: mockTravelProjectService },
      ],
    }).compile();

    controller = module.get<TravelProjectController>(TravelProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
