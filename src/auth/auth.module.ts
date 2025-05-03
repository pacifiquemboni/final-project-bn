import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret, // Use a valid secret
      signOptions: { expiresIn: '1h' }, // Set expiration
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy], // Register strategy
  exports: [AuthService],
})
export class AuthModule {}
