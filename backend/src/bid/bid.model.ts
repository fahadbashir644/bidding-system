import { Column, DataType, Model, Table, ForeignKey, Index, BelongsTo } from 'sequelize-typescript';
import { Item } from '../item/item.model';
import { User } from '../user/user.model';

@Table({ tableName: 'bids' })
export class Bid extends Model {
  @ForeignKey(() => Item)
  @Index
  @Column({ type: DataType.UUID })
  itemId: string;

  @ForeignKey(() => User)
  @Index
  @Column({ type: DataType.UUID })
  userId: string;

  @Column({ type: DataType.FLOAT })
  amount: number;

  @BelongsTo(() => User)
  user: User;
}