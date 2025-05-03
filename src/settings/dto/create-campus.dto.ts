import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateCampusDto {
    @ApiProperty({ description: 'The name of the campus', example: 'NYARUGENGE Campus' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The email of the campus', example: 'info@campus.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'The website of the campus', example: 'https://www.campus.com' })
    @IsString()
    @IsOptional()
    website?: string;

    @ApiProperty({
        description: 'The address of the campus',
        example: ['123 Main St', 'City', 'Country'],
    })
    @IsArray()
    @IsOptional()
    address?: string[];
}