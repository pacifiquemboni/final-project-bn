import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as path from 'path';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // or true for 465
        auth: {
          user: 'pacifiquemboni@gmail.com',
          pass: 'zpzs npuj dgjs oige',
        },
      },
      defaults: {
        from: '"UniDoc Request System" <pacifiquemboni@gmail.com>',
      },
      // template: {
      //  dir: path.join(__dirname, '..', 'mail', 'templates'),
      //   adapter: new HandlebarsAdapter(), // or new PugAdapter(), new EjsAdapter()
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}