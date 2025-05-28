import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { TranscriptRequest } from './transcript-request.entity';
import { Transcript } from './transcripts-marks.entity';

@Table({ tableName: 'transcript_Workflow' })
export class TranscriptWorkFlow extends Model<TranscriptWorkFlow> {
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

    @ForeignKey(() => Transcript)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    transcriptId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    file: string; 

    @Column({
        type: DataType.ENUM(
           
            'hod-approved',
            'hod-rejected',
            'dean-approved',
            'dean-rejected'
        )
    })
    status: 'hod-approved' | 'hod-rejected' | 'dean-approved' | 'dean-rejected';


    @BelongsTo(() => TranscriptRequest, { foreignKey: 'requestId' })
    transcriptRequest: TranscriptRequest;
    @BelongsTo(() => Transcript, { foreignKey: 'transcriptId' })
    transcript: Transcript;

    // Add any other associations or methods as needed
}