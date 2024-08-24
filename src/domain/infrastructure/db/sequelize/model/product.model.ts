import { Column, PrimaryKey, Table, Model, AllowNull } from "sequelize-typescript";

@Table({ tableName: "products", timestamps: false })

export class ProductModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}