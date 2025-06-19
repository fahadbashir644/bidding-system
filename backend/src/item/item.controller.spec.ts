import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../../src/item/item.controller';
import { ItemService } from '../../src/item/item.service';

describe('ItemsController', () => {
  let controller: ItemController;
  let mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should create an item and return all items', async () => {
    const dto = { name: 'Laptop', description: 'Fast laptop', startingPrice: 200, endTime: 5 };
    const expectedItemList = [{ id: '1', ...dto }];

    mockService.create.mockResolvedValue(undefined);
    mockService.findAll.mockResolvedValue(expectedItemList);

    const result = await controller.create(dto);
    expect(result).toEqual(expectedItemList);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return all items', async () => {
    mockService.findAll.mockResolvedValue([{ id: '1' }]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });

  it('should return a specific item', async () => {
    mockService.findById.mockResolvedValue({ id: '1' });
    const result = await controller.findById('1');
    expect(result.id).toBe('1');
  });
});