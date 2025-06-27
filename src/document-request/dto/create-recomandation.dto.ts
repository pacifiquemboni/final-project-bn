import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';


export class CreateRecomandationRequestDto {
    @ApiProperty({ description: 'The registration number of the requester', example: 'REG123456' })
    @IsString()
    regnumber: string;

    @ApiProperty({ description: 'The ID of the user who requested the recommendation', example: 1 })
     
    requestedbyId: number;

    @ApiProperty({ description: 'The ID of the school', example: 2 })
     
    schoolId: number;

    @ApiProperty({ description: 'The ID of the department', example: 3 })
     
    departmentId: number;

    @ApiProperty({ description: 'The ID of the user assigned to handle the request', example: 4, required: false })
     
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({ description: 'The reason for the recommendation request', example: 'For scholarship application' })
    @IsString()
    reason: string;

    @ApiProperty({ description: 'Additional description for the request', example: 'Need it urgently', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    // @ApiProperty({ description: 'The URL of the file associated with the request', example: 'https://example.com/file.pdf', required: false })
    
    @IsOptional()
    fileurl?: string;

    // @ApiProperty({
    //     description: 'The status of the recommendation request',
    //     example: 'PENDING',
    //     enum: ['PENDING', 'APPROVED', 'REJECTED'],
    // })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';

    @ApiProperty({ description: 'The level of study of the requester', example: 'Undergraduate' })
    @IsString()
    levelOfStudy: string;
}

export class UpdateRecomandationRequestDto extends PartialType (CreateRecomandationRequestDto) {}
export class UpdateRecomandationRequestStaffDto {
    @ApiProperty({ description: 'The URL of the file associated with the request', format:'binary', required: false })
    @IsOptional()
    fileurl?: string;
    @ApiProperty({
        description: 'The status of the recommendation request',
        example: 'APPROVED',
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
    })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
export class UpdateToWhomRequestStaffDto {
    @ApiProperty({ description: 'The URL of the file associated with the request', format:'binary', required: false })
    @IsOptional()
    fileurl?: string;
    @ApiProperty({
        description: 'The status of the recommendation request',
        example: 'APPROVED',
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
    })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class QuerryFindAllRecomandationRequestDto {
    @ApiProperty({ description: 'The registration number of the requester', required: false })
    @IsString()
    @IsOptional()
    regnumber?: string;


    @ApiProperty({ description: 'The ID of the user who requested the recommendation', required: false })

    @IsOptional()
    requestedbyId?: number;

    @ApiProperty({ description: 'The ID of the user assigned to handle the request', required: false })
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({ description: 'The status of the recommendation request',  required: false })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    @IsOptional()
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';


    @ApiProperty({ description: 'The school ID', required: false })
   
    @IsOptional()
    schoolId?: number;

    @ApiProperty({ description: 'The department ID',  required: false })
    
    @IsOptional()
    departmentId?: number;

    @ApiProperty({ description: 'The start date for filtering requests',  required: false })
    fromDate?: Date;

    @ApiProperty({ description: 'The end date for filtering requests',  required: false })
    toDate?: Date;
}
export class CreateToWhomRequestDto {
    @ApiProperty({ description: 'The registration number of the requester', example: 'REG123456' })
    @IsString()
    regnumber: string;

    @ApiProperty({ description: 'The ID of the user who requested the letter', example: 1 })
   
    requestedbyId: number;

    @ApiProperty({ description: 'The ID of the school', example: 2 })
   
    schoolId: number;

    @ApiProperty({ description: 'The ID of the department', example: 3 })
     
    departmentId: number;

    @ApiProperty({ description: 'The ID of the user assigned to handle the request', example: 4, required: false })
     
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({ description: 'The reason for the to-whom-it-may-concern letter', example: 'For visa application' })
    @IsString()
    reason: string;

    @ApiProperty({ description: 'Additional description for the request', example: 'Need it urgently', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    
    @IsOptional()
    fileurl?: string;

    @ApiProperty({
        description: 'The status of the to-whom-it-may-concern letter request',
        example: 'PENDING',
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
    })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @ApiProperty({ description: 'The level of study of the requester', example: 'Undergraduate' })
    @IsString()
    levelOfStudy: string;

    @ApiProperty({ description: 'Proof of payment file URL', example: 'https://example.com/payment.pdf', required: false, format:'binary' })
    @IsString()
    @IsOptional()
    proofofpayment?: string;
}