import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateDeclarationRequestDto {
    @ApiProperty({
        description: 'The registration number of the student',
        example: '20210001',
    })
    @IsNotEmpty()
    @IsString()
    regnumber: string;

    @ApiProperty({
        description: 'The ID of the user requesting the declaration',
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
        description: 'The reason for the declaration request',
        example: 'Lost original certificate',
    })
    @IsNotEmpty()
    @IsString()
    reason: string;

    @ApiProperty({
        description: 'Additional description for the request',
        example: 'The certificate was lost during relocation.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    // @ApiProperty({
    //     description: 'URL of the library clearance file',
    //     example: 'https://example.com/library-clearance.pdf',
    // })
    @IsOptional()
    @IsString()
    libraryFileUrl?: string;

    // @ApiProperty({
    //     description: 'URL of the finance clearance file',
    //     example: 'https://example.com/finance-clearance.pdf',
    // })
    @IsOptional()
    @IsString()
    financeFileUrl?: string;

    // @ApiProperty({
    //     description: 'URL of the welfare clearance file',
    //     example: 'https://example.com/welfare-clearance.pdf',
    // })
    @IsOptional()
    @IsString()
    welfareFileUrl?: string;

    // @ApiProperty({
    //     description: 'Library status of the request',
    //     example: 'PENDING',
    //     enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
    // })
    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    libraryStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    // @ApiProperty({
    //     description: 'Finance status of the request',
    //     example: 'PENDING',
    //     enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
    // })
    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    financeStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    // @ApiProperty({
    //     description: 'Welfare status of the request',
    //     example: 'PENDING',
    //     enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
    // })
    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    welfareStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'The graduation year of the student',
        example: '2022',
    })
    @IsOptional()
    @IsString()
    graduationYear: string;
}
export class UpdateDeclarationRequestLibraryDto {
    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    libraryStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'URL of the library clearance file',
        format: 'binary',
    })
    @IsOptional()
    @IsString()
    libraryFileUrl?: string;
}
export class UpdateDeclarationRequestFinanceDto {

    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    financeStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'URL of the library clearance file',
        format: 'binary',
    })
    @IsOptional()
    @IsString()
    financeFileUrl?: string;
}
export class UpdateDeclarationRequestWelfareDto {

    @IsNotEmpty()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    welfareStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'URL of the library clearance file',
        format: 'binary',
    })
    @IsOptional()
    @IsString()
    welfareFileUrl?: string;
}
export class CreateDeclarationChangeDto {
    @ApiProperty({
        description: 'The ID of the declaration request associated with the change',
        example: 1,
    })
    @IsNotEmpty()
    requestId: number;

    @ApiProperty({
        description: 'The department or section making the change',
        example: 'LIBRARY',
        enum: ['LIBRARY', 'FINANCE', 'WELFARE'],
    })
    @IsNotEmpty()
    @IsEnum(['LIBRARY', 'FINANCE', 'WELFARE'])
    from: 'LIBRARY' | 'FINANCE' | 'WELFARE';

    @ApiProperty({
        description: 'The comment or reason for the change',
        example: 'The document was not submitted on time.',
    })
    @IsNotEmpty()
    @IsString()
    comment: string;
}
export class QuerryFindAllDeclarationRequestDto {
    @ApiProperty({
        description: 'The registration number of the student',
        required: false,
    })
    @IsOptional()
    @IsString()
    regnumber?: string;

    @ApiProperty({
        description: 'The ID of the user who is requesting the declaration',
        required: false,
    })
    @IsOptional()
    requestedbyId?: number;

    @ApiProperty({
        description: 'Library status of the request',

        enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
        required: false,
    })
    @IsOptional()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    libraryStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'Finance status of the request',
        required: false,
        enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
    })
    @IsOptional()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    financeStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

    @ApiProperty({
        description: 'Welfare status of the request',
        required: false,
        enum: ['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'],
    })
    @IsOptional()
    @IsEnum(['PENDING', 'WAITING_PAYMENT', 'APPROVED', 'REJECTED'])
    welfareStatus: 'PENDING' | 'WAITING_PAYMENT' | 'APPROVED' | 'REJECTED';

}
export class CreateDeclarationProofOfPaymentDto {
    // @ApiProperty({
    //     description: 'The ID of the declaration request associated with the proof of payment',
    //     example: 1,
    // })
    @IsNotEmpty()
    requestId: number;

    @ApiProperty({
        description: 'The department or section the proof of payment is for',
        example: 'LIBRARY',
        enum: ['LIBRARY', 'FINANCE', 'WELFARE'],
    })
    @IsNotEmpty()
    @IsEnum(['LIBRARY', 'FINANCE', 'WELFARE'])
    to: 'LIBRARY' | 'FINANCE' | 'WELFARE';

    @ApiProperty({
        description: 'The URL of the proof of payment document',
        format: 'binary'
    })
    @IsNotEmpty()
    @IsString()
    proofOfpaymentUrl: string;
}