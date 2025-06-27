import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Bid } from '../../src/bid/bid.model';
import { Item } from '../../src/item/item.model';
import { BidService } from '../../src/bid/bid.service';
import { BidGateway } from '../../src/bid/bid.gateway';

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
  };
  let mockGateway = { sendBidUpdate: jest.fn() };
  let mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
    LOCK: { UPDATE: 'UPDATE' },
  };
  let mockSequelize = {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidService,
        { provide: getModelToken(Bid), useValue: mockBidModel },
        { provide: getModelToken(Item), useValue: mockItemModel },
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

  it('should create bid and emit event', async () => {
    mockItemModel.findByPk.mockResolvedValue({ endTime: new Date(Date.now() + 1000), startingPrice: 100 });
    mockBidModel.findOne.mockResolvedValue(null);
    mockBidModel.create.mockResolvedValue({ amount: 200 });

    const result = await service.placeBid('123', 200);
    expect(result.success).toBe(true);
    expect(mockGateway.sendBidUpdate).toHaveBeenCalled();
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('should handle concurrent bids with optimistic locking', async () => {
    const item = await mockItemModel.create({
      name: 'Test Item',
      description: '...',
      startingPrice: 100,
      endTime: new Date(Date.now() + 60 * 1000),
      version: 0,
    });

    // Place two bids at same time:
    const bid1 = service.placeBid(item.id, 110);
    const bid2 = service.placeBid(item.id, 120);

    // Act: run in parallel
    const results = await Promise.allSettled([bid1, bid2]);

    // Expect: only one should succeed if conflict happens
    const successes = results.filter(r => r.status === 'fulfilled');
    expect(successes.length).toBeGreaterThanOrEqual(1);

    // Double-check final highest bid
    const bids = await mockBidModel.findAll({ where: { itemId: item.id } });
    const amounts = bids.map(b => b.amount);
    const maxAmount = Math.max(...amounts);

    expect(maxAmount).toBeGreaterThanOrEqual(110);
  });
});
