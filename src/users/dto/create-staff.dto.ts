import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { StaffRole, UserRole } from './../entities/user.entity';

export class CreateStaffDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Niyonsaba' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'alice.niyonsaba@university.rw' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'SecureStaffPass456' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'Senior Librarian' })
  @IsOptional()
  @IsString()
  staffPosition?: string;

  @ApiPropertyOptional({
    description: 'Role to add to the staff member',
    enum: ['student',
      'staff',
      'dean_of_school',
      'hod',
      'director_of_languages',
      'librarian',
      'finance',
      'dean_of_student_welfare',
      'admin'],
    example: 'dean_of_school'
  })
  @IsOptional()
  roles?: 'student' |
    'staff' |
    'dean_of_school' |
    'hod' |
    'director_of_languages' |
    'librarian' |
    'finance' |
    'dean_of_student_welfare' |
    'admin';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  campusId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  schoolId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ example: '+250788765432' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg', format: 'binary' })
  @IsOptional()
  @IsString()
  signature?: string;
}
