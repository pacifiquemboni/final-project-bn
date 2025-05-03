import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { TranscriptRequest } from './transcript-request.entity';
import { EnglishCertificate } from './english-certificate.entity';
import { DeclarationCertificate } from './declaration-certificate.entity';

@Table({ tableName: 'declaration_proof_of_payments' })
export class DeclarationProofOfPayment extends Model<DeclarationProofOfPayment> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;


    @ForeignKey(() => DeclarationCertificate)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    requestId: number;

    @Column({
        type: DataType.ENUM('LIBRARY','FINANCE', 'WELFARE'),
        allowNull: false,
    })
    to:'LIBRARY'|'FINANCE'| 'WELFARE';

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    proofOfpaymentUrl: string;

    @BelongsTo(() => DeclarationCertificate ,{ foreignKey: 'requestId' })
    declarationCertificate: DeclarationCertificate;

    // Add any other associations or methods as needed
}