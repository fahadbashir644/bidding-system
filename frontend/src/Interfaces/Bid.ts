import type { User } from "./User";

export interface Bid {
  itemId: string;
  userId: string;
  amount: number;
  user: User 
}