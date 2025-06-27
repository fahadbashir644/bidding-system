import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { resolveScope, Sequelize } from 'sequelize-typescript';
import { Bid } from '../../src/bid/bid.model';
import { Item } from '../../src/item/item.model';
import { BidService } from '../../src/bid/bid.service';
import { BidGateway } from '../../src/bid/bid.gateway';
import { User } from '../user/user.model';

describe('BidService', () => {
  let service: BidService;
  let mockBidModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };
  let mockItemModel = {
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue([1])
  };
  let mockUserModel = { findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'John Doe' }]), };
  let mockGateway = { sendBidUpdate: jest.fn() };
  let mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };
  let mockSequelize = {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
    random: jest.fn().mockReturnValue('RANDOM()'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        { provide: getModelToken(Bid), useValue: mockBidModel },
        { provide: getModelToken(Item), useValue: mockItemModel },
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: BidGateway, useValue: mockGateway },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<BidService>(BidService);
  });

  it('should throw if item not found', async () => {
    mockItemModel.findByPk.mockResolvedValue(null);
    await expect(service.placeBid('123', 200)).rejects.toThrow('Item not found');
  });

  it('should throw if auction ended', async () => {
    mockItemModel.findByPk.mockResolvedValue({ endTime: new Date(Date.now() - 1000) });
    await expect(service.placeBid('123', 200)).rejects.toThrow('Auction ended');
  });

  it('should throw if bid is too low', async () => {
    mockItemModel.findByPk.mockResolvedValue({ endTime: new Date(Date.now() + 1000), startingPrice: 100 });
    mockBidModel.findOne.mockResolvedValue({ amount: 150 });
    await expect(service.placeBid('123', 140)).rejects.toThrow('Bid must be higher than current bid');
  });

  // it('should create bid and emit event', async () => {
  //   mockItemModel.findByPk.mockResolvedValue({
  //     id: 'item1',
  //     endTime: new Date(Date.now() + 1000),
  //     startingPrice: 100,
  //     version: 0,
  //     increment: jest.fn().mockResolvedValue(undefined),
  //   });

  //   mockBidModel.findOne.mockResolvedValue(null);
  //   mockBidModel.create.mockResolvedValue({ amount: 200 });
  //   mockUserModel.findAll.mockResolvedValue([{ id: 'user1', name: 'Alice' }]);

  //   const result = await service.placeBid('item1', 200);

  //   expect(result.success).toBe(true);
  //   expect(mockGateway.sendBidUpdate).toHaveBeenCalled();
  //   expect(mockTransaction.commit).toHaveBeenCalled();
  // });

  it('should handle concurrent bids with optimistic locking', async () => {
    const baseItem = {
      id: 'item-123',
      name: 'Test Item',
      startingPrice: 100,
      endTime: new Date(Date.now() + 60 * 1000),
      version: 0,
      increment: jest.fn().mockResolvedValue(undefined),
    };

    mockItemModel.findByPk.mockResolvedValue(baseItem);

    mockBidModel.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ amount: 110 });

    mockBidModel.create.mockResolvedValue({ amount: 110 });
    mockBidModel.create.mockResolvedValue({ amount: 120 });

    const bid1 = service.placeBid(baseItem.id, 110);
    const bid2 = service.placeBid(baseItem.id, 120);

    const results = await Promise.allSettled([bid1, bid2]);

    console.log(results);

    const successes = results.filter(r => r.status === 'fulfilled');
    expect(successes.length).toBeGreaterThanOrEqual(1);
  });
});
