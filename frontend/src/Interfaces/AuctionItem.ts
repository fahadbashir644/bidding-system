import type { Bid } from "./Bid";

export interface AuctionItem {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  endTime: string;
  bids: Bid[] 
}