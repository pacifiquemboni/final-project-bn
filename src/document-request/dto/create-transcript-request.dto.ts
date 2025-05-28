import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranscriptRequestDto {
    @ApiProperty({
        description: 'The registration number of the student',
        example: '20210001',
    })
    @IsNotEmpty()
    @IsString()
    regnumber: string;

    @ApiProperty({
        description: 'The ID of the user who is requesting the transcript',
        example: 1,
    })
    @IsNotEmpty()
    requestedbyId: number;

    @ApiProperty({
        description: 'The ID of the school associated with the request',
        example: 1,
    })
    @IsNotEmpty()
    schoolId: number;

    @ApiProperty({
        description: 'The ID of the department associated with the request',
        example: 1,
    })
    @IsNotEmpty()
    departmentId: number;

    @ApiProperty({
        description: 'The ID of the staff assigned to handle the request',
        example: 2,
        required: false,
    })
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({
        description: 'The year and month of completion of the student',
        example: '2023-05-25',
    })
    @IsNotEmpty()
    completionYear: Date;

    @ApiProperty({
        description: 'The reason for requesting the transcript',
        example: 'For further studies',
    })
    @IsNotEmpty()
    @IsString()
    reason: string;

    @ApiProperty({
        description: 'Additional description or details about the request',
        example: 'Requesting transcript for application to a foreign university',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'The URL of the passport photo',
        format: 'binary',
        required: false,
    })
    @IsOptional()
    @IsString()
    passphoto: string;

    @ApiProperty({
        description: 'The URL of the proof of payment',
        format: 'binary',
        required: false,
    })
    @IsOptional()
    @IsString()
    proofofpayment?: string;

    // @ApiProperty({
    //     description: 'The URL of the file associated with the request',
    //     example: 'https://example.com/file.pdf',
    //     required: false,
    // })
    @IsOptional()
    @IsString()
    fileurl?: string;

    // @ApiProperty({
    //     description: 'The status of the transcript request',
    //     example: 'PENDING',
    //     enum: ['PENDING', 'APPROVED', 'REJECTED'],
    // })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'The level of study of the student',
        example: 'Undergraduate',
    })
    @IsNotEmpty()
    @IsString()
    levelOfStudy: string;
}

export class CreateTranscriptChangesDto {
    @ApiProperty({
        description: 'The ID of the transcript request being changed',
        example: 1,
    })
    @IsNotEmpty()
    requestId: number;

    @ApiProperty({
        description: 'The comment or reason for the change',
        example: 'Updated the completion year',
    })
    @IsNotEmpty()
    @IsString()
    comment: string;
}
export class QuerryFindAllTranscriptRequestDto {
    @ApiProperty({
        description: 'The registration number of the student',
        required: false,
    })
    @IsOptional()
    @IsString()
    regnumber?: string;

    @ApiProperty({
        description: 'Full Names of the student',
        required: false,
    })
    @IsOptional()
    @IsString()
    fullNames?: string;

    @ApiProperty({
        description: 'The ID of the user who is requesting the transcript',
        required: false,
    })
    @IsOptional()
    requestedbyId?: number;

    @ApiProperty({
        description: 'The ID of the user assigned to handle the request',
        required: false,
    })
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({
        description: 'The status of the transcript request',
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        required: false,
    })
    @IsOptional()
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';

    @ApiProperty({ description: 'The school ID', required: false })
    @IsOptional()
    schoolId?: number;

    @ApiProperty({ description: 'The department ID', required: false })
    @IsOptional()
    departmentId?: number;
    @ApiProperty({ description: 'The start date for filtering requests',  required: false })
    fromDate?: Date;

    @ApiProperty({ description: 'The end date for filtering requests',  required: false })
    toDate?: Date;
}   

export class UpdateTranscriptRequestDto {
    @ApiProperty({
        description: 'The URL of the file associated with the request',
        example: 'https://example.com/file.pdf',
        required: false,
    })
    @IsOptional()
    @IsString()
    fileurl?: string;
}