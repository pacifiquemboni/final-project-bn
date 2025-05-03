// user.model.ts
import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { School } from './school.entity';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'campuses' })
export class Campus extends Model<Campus> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    website: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    address: string[];

    @HasMany(() => School)
    schools: School[];

    @HasMany(() => User)
    users: User[];
}
