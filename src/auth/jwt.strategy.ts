import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
   // return { id: payload.id, email: payload.username, role: payload.role, cooperativeId: payload.cooperativeId };
   return { id: payload.id,name:payload.firstName, username: payload.email, regnumber:payload.regNumber, role: payload.roles,campusId:payload.campusId, schoolId: payload.schoolId, departmentId: payload.departmentId };
  }
}
