// user.model.ts
import { UUID } from 'crypto';
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { User } from 'src/users/entities/user.entity';

import { Transcript } from './transcripts-marks.entity';
import { TranscriptRequest } from './transcript-request.entity';

@Table({ tableName: 'link_requests' })
export class LinkRequest extends Model<LinkRequest> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    regNumber: string;
    
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
    TranscriptId: number;

    @BelongsTo(() => Transcript)
    campus: Transcript

   
    @HasMany(() => User)
    users: User[];
}
