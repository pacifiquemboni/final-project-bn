import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiPropertyOptional({ example: '221003571' })
  @IsOptional()
  @IsString()
  regNumber?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssword123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  campusId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  schoolId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ example: '+250788123456' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
