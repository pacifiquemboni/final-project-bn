import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { User, UserRole } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()

export class UsersService {
  constructor(
    private readonly sequelize: Sequelize,
  ) { }
  private get userRepository() {
    return this.sequelize.getRepository(User);
  }
  async registerStudent(createstudentDto: CreateStudentDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { regNumber: createstudentDto.regNumber},
      });

      if (existingUser) {
        throw new BadRequestException('User with the provided renumber and email already exists.');
      }

      return await this.userRepository.create({ ...createstudentDto, roles: 'student' } as User);
    } catch (error) {
      throw new BadRequestException(error.message || 'An error occurred while registering the student.');
    }
  }
  findAllStudents() {
    return this.userRepository.findAll({ where: { roles: ['student'] } });
  }
  findOneStdent(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  updateStudent(id: number, updateStudentDto: UpdateStudentDto) {
    return this.userRepository.update(updateStudentDto, { where: { id } });
  }
  async registerStaff(createstaffDto: CreateStaffDto) {
    const existingStaff = await this.userRepository.findOne({
      where: { email: createstaffDto.email, campusId: createstaffDto.campusId },
    });

    if (existingStaff) {
      throw new BadRequestException('Staff with the provided email and campus ID already exists.');
    }

    return this.userRepository.create({ ...createstaffDto } as User);
  }

  findAllStaff() {
    return this.userRepository.findAll();
  }

  findOneStaff(id: number) {
    return this.userRepository.findOne();
  }

  updateStaff(id: number, updateStaffDto: UpdateStaffDto) {
    return this.userRepository.update(updateStaffDto, { where: { id } });
  }

  async addRoleToStaff(id: number, role: string) {
    const staff = await this.userRepository.findOne({ where: { id } });
    if (!staff) {
      throw new BadRequestException('Staff member not found');
    }

    // Fix for roles not being iterable
    const currentRoles = Array.isArray(staff.roles) ? staff.roles :
      (staff.roles ? [staff.roles] : []);
    // Add the new role and ensure no duplicates
    const updatedRoles = Array.from(new Set([...currentRoles, role])) as UserRole[];

    // return this.userRepository.update(
    //   { roles: updatedRoles },
    //   { where: { id } }
    // );
  }
}
