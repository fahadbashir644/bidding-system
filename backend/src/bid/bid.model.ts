import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Item } from '../item/item.model';
import { User } from '../user/user.model';

@Table({ tableName: 'bids' })
export class Bid extends Model {
  @ForeignKey(() => Item)
  @Column({ type: DataType.UUID })
  itemId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @Column({ type: DataType.FLOAT })
  amount: number;
}