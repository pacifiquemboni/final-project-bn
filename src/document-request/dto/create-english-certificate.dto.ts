import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnglishCertificateDto {
    @ApiProperty({ description: 'The registration number of the requester', required: true, example: '2021001234' })
    @IsString()
    regnumber: string;

    @ApiProperty({ description: 'The ID of the user who requested the certificate', required: true, example: 1 })
     
    requestedbyId: number;

    @ApiProperty({ description: 'The school ID', required: true, example: 101 })
     
    schoolId: number;

    @ApiProperty({ description: 'The department ID', required: true, example: 202 })
     
    departmentId: number;

    @ApiProperty({ description: 'The ID of the user assigned to handle the request', required: false, example: 3 })
     
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({ description: 'The reason for the certificate request', required: true, example: 'For job application' })
    @IsString()
    reason: string;

    @ApiProperty({ description: 'Additional description for the request', required: false, example: 'Urgent processing required' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'URL of the National ID document',format:'binary', required: false })
    @IsString()
    @IsOptional()
    nidurl: string;

    @ApiProperty({ description: 'URL of the transcript document',format:'binary', required: false })
    @IsString()
    @IsOptional()
    transcripturl?: string;

    @ApiProperty({ description: 'URL of the degree document',format:'binary', required: false })
    @IsString()
    @IsOptional()
    degreeurl?: string;

    @ApiProperty({ description: 'URL of the proof of payment document',format:'binary', required: false })
    @IsString()
    @IsOptional()
    proofofpayment: string;

    // @ApiProperty({ description: 'URL of the uploaded file', required: false })
    @IsString()
    @IsOptional()
    fileurl?: string;

    // @ApiProperty({ description: 'The status of the certificate request', required: true, example: 'PENDING' })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @ApiProperty({ description: 'The graduation year of the requester', required: true, example: '2022' })
    @IsString()
    graduationYear: string;
}
export class UpdateEnglishCertificateRequestDto extends PartialType(CreateEnglishCertificateDto) {}
export class UpdateEnglishCertificateRequestStaffDto {
    @ApiProperty({ description: 'URL of the uploaded file',format:'binary', required: false })
    @IsString()
    @IsOptional()
    fileurl?: string;

    // @ApiProperty({ description: 'The status of the certificate request', required: true, example: 'PENDING' })
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; 
}
export class CreateEnglishCertificateChangesDto {
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

export class QuerryFindAllEnglishCertificateRequestDto {
    @ApiProperty({ description: 'The registration number of the requester', required: false })
    @IsString()
    @IsOptional()
    regnumber?: string;

    @ApiProperty({ description: 'The ID of the user who requested the certificate', required: false })
     
    @IsOptional()
    requestedbyId?: number;

    @ApiProperty({ description: 'The ID of the user assigned to handle the request', required: false })
     
    @IsOptional()
    assignedToId?: number;

    @ApiProperty({
         description: 'The status of the certificate request',
          required: false,
         enum: ['PENDING', 'APPROVED', 'REJECTED'],})
    @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
    @IsOptional()
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
   
}