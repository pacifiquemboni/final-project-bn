import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Department } from 'src/settings/entities/department.entity';
import { School } from 'src/settings/entities/school.entity';
import { User } from 'src/users/entities/user.entity';
// Removed unused import for TranscriptChanges
import { DeclarationChanges } from 'src/document-request/entities/declaration-changes.entity';
import { DeclarationProofOfPayment } from 'src/document-request/entities/declaration-proof-of-payment.entity';

@Table({ tableName: 'declaration_certificates' })
export class DeclarationCertificate extends Model<DeclarationCertificate> {
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
    libraryFileUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    financeFileUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    welfareFileUrl: string;


    @Column({
        type: DataType.ENUM('PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'),
        allowNull: false,
    })
    libraryStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @Column({
        type: DataType.ENUM('PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'),
        allowNull: false,
    })
    financeStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @Column({
        type: DataType.ENUM('PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'),
        allowNull: false,
    })
    welfareStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    graduationYear: string;

    @BelongsTo(() => User, { foreignKey: 'requestedbyId' })
    requestedBy: User;

    @BelongsTo(() => School, { foreignKey: 'schoolId' })
    school: School;

    @BelongsTo(() => Department, { foreignKey: 'departmentId' })
    department: Department;

    @HasMany(() => DeclarationChanges, { foreignKey: 'requestId' })
    declarationChanges: DeclarationChanges[];

    @HasMany(() => DeclarationProofOfPayment, { foreignKey: 'requestId', as: 'declarationProofOfPayment' })
    declarationProofOfPayment: DeclarationProofOfPayment[];

}