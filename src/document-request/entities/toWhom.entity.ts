import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Department } from 'src/settings/entities/department.entity';
import { School } from 'src/settings/entities/school.entity';
import { User } from 'src/users/entities/user.entity';


@Table({ tableName: 'towhom_letters' })
export class ToWhomLetter extends Model<ToWhomLetter> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    regnumber: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    requestedbyId: number;

    @ForeignKey(() => School)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    schoolId: number;

    @ForeignKey(() => Department)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    departmentId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    assignedToId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    reason: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    fileurl: string;

    @Column({
        type: DataType.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
    })
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    levelOfStudy: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    proofofpayment: string;

    @BelongsTo(() => User, { foreignKey: 'requestedbyId' })
    requestedBy: User;
    @BelongsTo(() => User, { foreignKey: 'assignedToId' })
    assignedTo: User;
    @BelongsTo(() => School, { foreignKey: 'schoolId' })
    school: School;
    @BelongsTo(() => Department, { foreignKey: 'departmentId' })
    department: Department;
    // Add any other associations or methods as needed
}