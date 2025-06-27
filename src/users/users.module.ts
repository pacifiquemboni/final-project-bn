import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import Mail from 'nodemailer/lib/mailer';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, MailService],
})
export class UsersModule {}
