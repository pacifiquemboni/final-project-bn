import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateCampusDto } from './dto/create-campus.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('/campus')
  @ApiOperation({ summary: 'Create Campus ' })
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.settingsService.create(createCampusDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all Campus ' })

  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get campus by id ' })

  findOne(@Param('id') id: number) {
    return this.settingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update campus by id ' })

  update(@Param('id') id: number, @Body() updateCampusDto: UpdateCampusDto) {
    return this.settingsService.update(id, updateCampusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete campus by id ' })

  remove(@Param('id') id: number) {
    return this.settingsService.remove(id);
  }
//department controller
  @Post('/school')
  @ApiOperation({ summary: 'Create School ' })
  createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return this.settingsService.createSchool(createSchoolDto);
  }

  @Get('schools')
  @ApiOperation({ summary: 'get all School ' })

  findAllSchool() {
    return this.settingsService.findAllSchool();
  }

  @Get('school/:id')
  @ApiOperation({ summary: 'get School by id ' })

  findOneSchool(@Param('id') id: number) {
    return this.settingsService.findOneSchool(id);
  }

  @Patch('school/:id')
  @ApiOperation({ summary: 'update School by id ' })
  updateSchool(@Param('id') id: number, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.settingsService.updateSchool(id, updateSchoolDto);
  }

  @Delete('school/:id')
  @ApiOperation({ summary: 'delete School by id ' })
  removeSchool(@Param('id') id: number) {
    return this.settingsService.removeSchool(id);
  }

  //School controller
  @Post('/Department')
  @ApiOperation({ summary: 'Create Department ' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.settingsService.createDepartment(createDepartmentDto);
  }

  @Get('Departments')
  @ApiOperation({ summary: 'get all Department ' })

  findAllDepartment() {
    return this.settingsService.findAllDepartment();
  }

  @Get('Department/:id')
  @ApiOperation({ summary: 'get Department by id ' })

  findOneDepartment(@Param('id') id: number) {
    return this.settingsService.findOneDepartment(id);
  }

  @Patch('Department/:id')
  @ApiOperation({ summary: 'update Department by id ' })
  updateDepartment(@Param('id') id: number, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.settingsService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete('Department/:id')
  @ApiOperation({ summary: 'delete Department by id ' })
  removeDepartment(@Param('id') id: number) {
    return this.settingsService.removeDepartment(id);
  }
}
