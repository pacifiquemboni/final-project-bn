import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Department } from 'src/settings/entities/department.entity';
import { School } from 'src/settings/entities/school.entity';
import { User } from 'src/users/entities/user.entity';
import { TranscriptChanges } from './transcript-changes.entity';
import { EnglishChanges } from './english-changes.entity';

@Table({ tableName: 'english_certificates' })
export class EnglishCertificate extends Model<EnglishCertificate> {
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
    nidurl: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    transcripturl: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    degreeurl: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    proofofpayment: string;

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
    graduationYear: string;

    @BelongsTo(() => User, { foreignKey: 'requestedbyId' })
    requestedBy: User;

    @BelongsTo(() => User, { foreignKey: 'assignedToId' })
    assignedTo: User;

    @BelongsTo(() => School, { foreignKey: 'schoolId' })
    school: School;

    @BelongsTo(() => Department, { foreignKey: 'departmentId' })
    department: Department;

   
    @HasMany(() => EnglishChanges, { foreignKey: 'requestId' })
    englishChanges: EnglishChanges[];
}