import { ConfigType } from '@nestjs/config';
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../../../../config';
import { JwtRequest } from '../interfaces/jwt.request.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => {
          return request?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.auth.access,
    });
  }

  validate(payload: any) {
    return { ...payload };
  }
}
