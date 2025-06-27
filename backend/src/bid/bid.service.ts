import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bid } from './bid.model';
import { Item } from '../item/item.model';
import { BidGateway } from './bid.gateway';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { OptimisticLockError } from 'sequelize';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid) private bidModel: typeof Bid,
    @InjectModel(Item) private itemModel: typeof Item,
    @InjectModel(User) private userModel: typeof User,
    private readonly bidGateway: BidGateway,
    private readonly sequelize: Sequelize,
  ) {}

 async placeBid(itemId: string, amount: number) {
  const item = await this.itemModel.findByPk(itemId);
  if (!item) throw new BadRequestException('Item not found');

  const now = new Date();
  if (item.endTime < now) {
    throw new BadRequestException('Auction ended');
  }

  const highestBid = await this.bidModel.findOne({
    where: { itemId },
    order: [['amount', 'DESC']],
  });

  const currentAmount = highestBid?.get('amount') || item.startingPrice;
  console.log('highest bid ', highestBid);
  console.log('current amount ', amount);
  console.log('highest amount ', currentAmount);
  if (amount <= currentAmount) {
    throw new BadRequestException('Bid must be higher than current bid');
  }

  const [user] = await this.userModel.findAll({
    order: this.sequelize.random(),
    limit: 1,
  });

  try {
    const [updatedCount] = await this.itemModel.update(
      { version: item.version + 1 },
      { where: { id: item.id, version: item.version } }
    );

    console.log('Version ', item.version);
    if (updatedCount === 0) {
      const latest = await this.bidModel.findOne({
        where: { itemId },
        order: [['amount', 'DESC']],
      });

      const latestAmount = latest?.get('amount') || item.startingPrice;
      console.log('current Bid', amount);
      console.log('Latest bid', latestAmount);
      if (amount <= latestAmount) {
        throw new BadRequestException('A higher bid already exists');
      }
    }

    const bid = await this.bidModel.create({ itemId, userId: user.id, amount });

    this.bidGateway.sendBidUpdate({
      itemId,
      amount,
      userId: user.id,
      user,
      timestamp: new Date().toISOString(),
    });

    return { success: true, bid };
  } catch (err) {
    throw err;
  }
 }
}
