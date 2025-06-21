import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSchoolDto {
    @ApiProperty({ description: 'The ID of the campus this school belongs to', example: 1 })
    @IsNotEmpty()
    campusId: number;

    @ApiProperty({ description: 'The name of the school', example: 'School of Engineering' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The number of departments in the school', example: 5 })
    @IsOptional()
    departments?: number;

    @ApiProperty({ description: 'The name of the dean of the school', example: 'Dr. Jane Smith' })
    @IsString()
    @IsOptional()
    deanOfSchool?: string;

    @ApiProperty({ description: 'stamp for the school', example: 'https://example.com/school-stamp.png', format: 'binary' })
    @IsOptional()
    stamp: string;
}