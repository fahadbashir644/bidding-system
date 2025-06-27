import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './item.model';
import { Bid } from '../bid/bid.model';
import { User } from 'src/user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Item, Bid, User])],
  providers: [ItemService],
  controllers: [ItemController]
})
export class ItemModule {}
