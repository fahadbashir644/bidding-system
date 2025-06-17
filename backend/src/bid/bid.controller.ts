import { Body, Controller, Post } from '@nestjs/common';
import { BidService } from './bid.service';

@Controller('items/bid')
export class BidController {
  constructor(private readonly bidsService: BidService) {}

  @Post()
  async placeBid(
    @Body('itemId') itemId: string,
    @Body('amount') amount: number
  ) {
    return this.bidsService.placeBid(itemId, amount);
  }
}