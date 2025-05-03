import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Campus } from './entities/campus.entity';
import { School } from './entities/school.entity';
import { Department } from './entities/department.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[ SequelizeModule.forFeature([
    Campus,School,Department
  ])],
  controllers: [SettingsController],
  providers: [SettingsService,JwtService],
})
export class SettingsModule {}
