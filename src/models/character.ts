import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'characters',
  timestamps: false,
})
export class Character extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  status!: string;

  @Column(DataType.STRING)
  species!: string;

  @Column(DataType.STRING)
  gender!: string;

  @Column({ field: 'origin_name', type: DataType.STRING })
  originName!: string;

  @Column(DataType.STRING)
  image!: string;
}

export default Character;
