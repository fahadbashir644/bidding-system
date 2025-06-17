import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { Item } from '../item/item.model';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { BidGateway } from './bid.gateway';

@Module({
  imports: [SequelizeModule.forFeature([Bid, Item])],
  providers: [BidService, BidGateway],
  controllers: [BidController],
})
export class BidModule {}
