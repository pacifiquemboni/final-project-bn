import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { TranscriptRequest } from './transcript-request.entity';
import { EnglishCertificate } from './english-certificate.entity';

@Table({ tableName: 'english_changes' })
export class EnglishChanges extends Model<EnglishChanges> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;


    @ForeignKey(() => EnglishCertificate)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    requestId: number;



    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    comment: string;

    @BelongsTo(() => EnglishCertificate ,{ foreignKey: 'requestId' })
    englishCertificate: EnglishCertificate;

    // Add any other associations or methods as needed
}