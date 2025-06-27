import { Column, DataType, Model, Table, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { Bid } from '../bid/bid.model';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'items', version: true })
export class Item extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  startingPrice: number;

  @Column({ type: DataType.DATE, allowNull: false })
  endTime: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare version: number;

  @HasMany(() => Bid)
  bids?: Bid[];
}