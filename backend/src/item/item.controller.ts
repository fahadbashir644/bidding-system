import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './item.model';

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item[]> {
    await this.itemService.create(createItemDto);
    return this.itemService.findAll();
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Item> {
    return this.itemService.findById(id);
  }
}
