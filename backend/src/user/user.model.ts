import { Column, Model, PrimaryKey, Table, Default, DataType, HasMany } from 'sequelize-typescript';
import { Bid } from '../bid/bid.model';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'users' })
export class User extends Model {
    @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  declare id: string;
  
   @Column({ allowNull: false })
  name: string;

  @HasMany(() => Bid)
  bids: Bid[];
}