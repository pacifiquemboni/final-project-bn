// user.model.ts
import { UUID } from 'crypto';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Campus } from './campus.entity';
import { School } from './school.entity';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'departments' })
export class Department extends Model<Department> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @ForeignKey(() => School)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    schoolId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    deanOfSchool: string;

    @BelongsTo(() => School)
    schools: School;

    @HasMany(() => User)
    users: User[];

}
