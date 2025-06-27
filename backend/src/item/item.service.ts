import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './item.model';
import { CreateItemDto } from './dto/create-item.dto';
import { Bid } from '../bid/bid.model';
import { User } from '../user/user.model';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item) private itemModel: typeof Item = Item
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const endTime = new Date(Date.now() + createItemDto.endTime * 60000);
    return await this.itemModel.create({ ...createItemDto, endTime});
  }

  async findAll(): Promise<Item[]> {
    return await this.itemModel.findAll({
      include: [
        {
          model: Bid,
          include: [User],
        },
      ],
    });
  }

  async findById(id: string): Promise<Item> {
    const item = await this.itemModel.findByPk(id);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
}
