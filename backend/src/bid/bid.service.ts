import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { Item } from '../item/item.model';
import { BidGateway } from './bid.gateway';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid) private bidModel: typeof Bid,
    @InjectModel(Item) private itemModel: typeof Item,
    private readonly bidGateway: BidGateway,
    private readonly sequelize: Sequelize,
  ) {}

  async placeBid(itemId: string, amount: number) {
    const transaction = await this.sequelize.transaction();

    try {
      const item = await this.itemModel.findByPk(itemId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!item) throw new BadRequestException('Item not found');

      const now = new Date();
      if (item.endTime < now) throw new BadRequestException('Auction ended');

      const highestBid = await this.bidModel.findOne({
        where: { itemId },
        order: [['amount', 'DESC']],
        transaction,
      });

      if (amount <= (highestBid?.amount || item.startingPrice)) {
        throw new BadRequestException('Bid must be higher than current bid');
      }

      const userId = 1;
      const bid = await this.bidModel.create(
        { itemId, userId, amount },
        { transaction }
      );

      await transaction.commit();

      this.bidGateway.sendBidUpdate({
        itemId,
        amount,
        userId,
        timestamp: new Date().toISOString(),
      });

      return { success: true, bid };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
