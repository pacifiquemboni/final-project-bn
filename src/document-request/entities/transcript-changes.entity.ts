import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { TranscriptRequest } from './transcript-request.entity';

@Table({ tableName: 'transcript_changes' })
export class TranscriptChanges extends Model<TranscriptChanges> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;


    @ForeignKey(() => TranscriptRequest)
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

    @BelongsTo(() => TranscriptRequest ,{ foreignKey: 'requestId' })
    transcriptRequest: TranscriptRequest;

    // Add any other associations or methods as needed
}