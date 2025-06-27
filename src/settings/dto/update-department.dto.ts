import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateDepartmentDto {
    @ApiProperty({ description: 'The ID of the school this department belongs to', example: 1 })
     
    @IsNotEmpty()
    schoolId: number;

    @ApiProperty({ description: 'The name of the department', example: 'Computer Science' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The name of the head of department', example: 'Dr. John Doe' })
    @IsString()
    @IsOptional()
    deanOfSchool?: string;
}