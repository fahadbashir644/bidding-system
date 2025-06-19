import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ItemService } from '../../src/item/item.service';
import { Item } from '../../src/item/item.model';

describe('ItemService', () => {
  let service: ItemService;
  let mockItemModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getModelToken(Item),
          useValue: mockItemModel,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should create an item', async () => {
    const dto = {
      name: 'Phone',
      description: 'Smartphone',
      startingPrice: 100,
      endTime: 10,
    };
    mockItemModel.create.mockResolvedValue({ ...dto, id: '1' });
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
    expect(mockItemModel.create).toHaveBeenCalled();
  });

  it('should find all items', async () => {
    mockItemModel.findAll.mockResolvedValue([{}]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should throw error if item not found', async () => {
    mockItemModel.findByPk.mockResolvedValue(null);
    await expect(service.findById('invalid')).rejects.toThrow('Item not found');
  });
});
