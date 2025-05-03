import { Controller, Get, Post, Body, Patch, Param, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProperty } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { IsEnum } from 'class-validator';

// Create an enum for the roles
enum StaffRole {
  STUDENT = 'student',
  STAFF = 'staff',
  DEAN_OF_SCHOOL = 'dean_of_school',
  HOD = 'hod',
  DIRECTOR_OF_LANGUAGES = 'director_of_languages',
  LIBRARIAN = 'librarian',
  FINANCE = 'finance',
  DEAN_OF_STUDENT_WELFARE = 'dean_of_student_welfare'
}

// Create a DTO for the request body
class AddRoleDto {
  @ApiProperty({
    description: 'Role to add to the staff member',
    enum: StaffRole,
    example: 'dean_of_school'
  })
  @IsEnum(StaffRole)
  role: StaffRole;
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register-student')
  @ApiOperation({ summary: 'Register a new student' })
  async registerStudent(@Body() createStudentDto: CreateStudentDto) {
    try {
      return await this.usersService.registerStudent(createStudentDto);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map((e) => e.message).join(', ');
        throw new BadRequestException(`Validation failed: ${messages}`);
      }
      throw new BadRequestException(`Failed to register student: ${error.message}`);
    }
  }

  @Get('students')
  @ApiOperation({ summary: 'Retrieve all students' })
  findAllStudents() {
    return this.usersService.findAllStudents();
  }

  @Get('students/:id')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  findOneStudent(@Param('id') id: string) {
    return this.usersService.findOneStdent(+id);
  }

  @Patch('students/:id')
  @ApiOperation({ summary: 'Update a student by ID' })
  updateStudent(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.usersService.updateStudent(+id, updateStudentDto);
  }
  @Post('register-staff')
  @ApiBody({ type: CreateStaffDto, description: 'Form data for registering a new staff member' })
  @ApiOperation({ summary: 'Register a new staff member by admin' })
  registerStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.registerStaff(createStaffDto);
  }

  @Get('staff')
  @ApiOperation({ summary: 'Retrieve all staff members' })
  findAllStaff() {
    return this.usersService.findAllStaff();
  }

  @Get('staff/:id')
  @ApiOperation({ summary: 'Retrieve a staff member by ID' })
  findOneStaff(@Param('id') id: string) {
    return this.usersService.findOneStaff(+id);
  }

  @Patch('staff/:id')
  @ApiOperation({ summary: 'Update a staff member by ID' })
  updateStaff(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.usersService.updateStaff(+id, updateStaffDto);
  }
  @Patch('staff/:id/add-role')
  @ApiOperation({ summary: 'Add a role to a staff member' })
  @ApiParam({ name: 'id', description: 'Staff member ID' })
  @ApiBody({ type: AddRoleDto })
  async addRoleToStaff(@Param('id') id: string, @Body() addRoleDto: AddRoleDto) {
    return this.usersService.addRoleToStaff(+id, addRoleDto.role);
  }
}
