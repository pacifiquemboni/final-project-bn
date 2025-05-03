import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSchoolDto {
    @ApiProperty({ description: 'The ID of the campus this school belongs to', example: 1 })
    @IsInt()
    @IsNotEmpty()
    campusId: number;

    @ApiProperty({ description: 'The name of the school', example: 'School of Engineering' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The number of departments in the school', example: 5 })
    @IsInt()
    @IsOptional()
    departments?: number;

    @ApiProperty({ description: 'The name of the dean of the school', example: 'Dr. Jane Smith' })
    @IsString()
    @IsOptional()
    deanOfSchool?: string;
}