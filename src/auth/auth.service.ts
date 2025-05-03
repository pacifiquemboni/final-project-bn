
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';

import { permission } from 'process';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly sequelize:Sequelize
  ) {}
private get userRepository(){
  return this.sequelize.getRepository(User)
}
  async signIn(
   @Body() logindto:LoginDto
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({where:{email:logindto.username}});
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const userData = user.dataValues
    console.log(userData);
    
    if (logindto.password !== userData.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { 
      id: userData.id, 
      username: userData.email, 
      regnumber: userData.regNumber, 
      role: userData.roles, 
      campusId: userData.campusId,
      schoolId: userData.schoolId, 
      departmentId: userData.departmentId 
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
