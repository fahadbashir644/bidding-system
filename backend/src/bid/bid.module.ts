import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { Item } from '../item/item.model';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { BidGateway } from './bid.gateway';
import { User } from 'src/user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Bid, Item, User])],
  providers: [BidService, BidGateway],
  controllers: [BidController],
})
export class BidModule {}
