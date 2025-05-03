import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';
import { DocumentRequestModule } from './document-request/document-request.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables available globally
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Adjust the path if needed
      serveRoot: '/uploads', // URL path
    }),
    SequelizeModule.forRootAsync({
      useFactory: async () => ({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10), // Default to 5432 if DB_PORT is undefined
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        autoLoadModels: true, // Automatically loads models
        synchronize: true, // Automatically syncs schema (Not recommended for production)
        logging: false, // Disable logging for cleaner output
      }),
      inject: [],
    }),
    SettingsModule,
    UsersModule,
    DocumentRequestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    const sequelize = new (require('sequelize')).Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    sequelize
      .authenticate()
      .then(() => console.log('Database connected successfully'))
      .catch((err) => console.error('Unable to connect to the database:', err));
  }
}
