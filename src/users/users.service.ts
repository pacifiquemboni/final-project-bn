import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { User, UserRole } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Op } from 'sequelize';
import { Campus } from 'src/settings/entities/campus.entity';
import { School } from 'src/settings/entities/school.entity';
import { Department } from 'src/settings/entities/department.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()

export class UsersService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly mailService: MailService, // Assuming mailService is injected for sending emails
  ) { }
  private get userRepository() {
    return this.sequelize.getRepository(User);
  }
  async registerStudent(createstudentDto: CreateStudentDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { regNumber: createstudentDto.regNumber },
      });

      if (existingUser) {
        throw new BadRequestException('User with the provided regNumber and email already exists.');
      }

      const user = await this.userRepository.create({ ...createstudentDto, roles: 'student' } as User);

      // Send email notification
      if (this.mailService && createstudentDto.email) {
  await this.mailService.sendMail(
    createstudentDto.email,
    'Welcome to UniDoc Student Portal',
    `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.6;">
      <p>Dear ${user.dataValues.firstName || user.dataValues.lastName},</p>

      <p>Welcome to the <strong>UniDoc Student Portal</strong>! Your student account has been successfully created.</p>

      <p><strong>Registration Number:</strong> ${createstudentDto.regNumber}<br/>
      <strong>Role:</strong> ${user.dataValues.roles}</p>

      <p>
        The UniDoc Student Portal is your central platform for managing official academic documentation requests.
        Through the portal, you can:
        <ul>
          <li>Submit requests for transcripts, recommendation letters, and certificates</li>
          <li>Track the progress of your document requests in real-time</li>
          <li>Receive updates and notifications about approvals or required actions</li>
          <li>Download finalized documents directly from your account</li>
        </ul>
      </p>

      <p>We encourage you to explore the platform and make use of the self-service features designed to save you time and provide transparency in your academic journey.</p>

      <p>Please keep your credentials safe and avoid sharing your login details with others.</p>

      <p>If you encounter any issues or need support, feel free to reach out to our technical team via the Help or Support section of the portal.</p>

      <p>We’re excited to have you on board!</p>

      <p>Best regards,<br/>
      The UniDoc Team</p>
    </div>
    `
  );
}


      return user;
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

    const user = await this.userRepository.create({ ...createstaffDto } as User);

    // Send email notification
    if (this.mailService && createstaffDto.email) {
      await this.mailService.sendMail(
      createstaffDto.email,
      'Welcome to UniDoc Staff Portal',
      `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
      <p>Dear ${user.dataValues.firstName || user.dataValues.lastName},</p>

      <p>Welcome to the UniDoc Staff Portal! Your account has been created successfully.</p>

      <p><strong>Username (Email):</strong> ${createstaffDto.email}</p>
      <p><strong>Password:</strong> ${createstaffDto.password}</p>
      <p><strong>Role:</strong> ${user.dataValues.roles}</p>

      <p>Please keep this email private and do not share your login credentials with anyone.</p>

      <p>If you have any questions or need assistance, please contact our support team.</p>

      <p>Best regards,<br/>The UniDoc Team</p>
      </div>
      `
      );
    }

    return user;
  }

  findAllStaff() {
  return this.userRepository.findAll({
    where: {
      roles: { [Op.ne]: 'student' } // Using Sequelize operator for "not equal"
    },
    include: [
      {
        model: this.sequelize.getRepository(Campus),
        as: 'campus',
        attributes: ['id', 'name'],
      },
      {
        model: this.sequelize.getRepository(School),
        as: 'school',
        attributes: ['id', 'name'],
      },
      {
        model: this.sequelize.getRepository(Department),
        as: 'department',
        attributes: ['id', 'name'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
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
