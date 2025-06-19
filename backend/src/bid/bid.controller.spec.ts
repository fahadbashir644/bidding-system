import { Test, TestingModule } from '@nestjs/testing';
import { BidController } from '../../src/bid/bid.controller';
import { BidService } from '../../src/bid/bid.service';

describe('BidsController', () => {
  let controller: BidController;
  let mockService = {
    placeBid: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidController],
      providers: [
        {
          provide: BidService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BidController>(BidController);
  });

  it('should place a bid', async () => {
    const amount = 500;
    mockService.placeBid.mockResolvedValue({ success: true });
    const result = await controller.placeBid('item-1', amount);
    expect(result.success).toBe(true);
    expect(mockService.placeBid).toHaveBeenCalledWith('item-1', amount);
  });
});
