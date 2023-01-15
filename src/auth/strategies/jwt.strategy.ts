import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dto/payload.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'XQlWKIs2sMuQMvfIHeIRLU52g4WxvJUT',
    });
  }

  async validate(payload: PayloadDto) {
    return await this.authService.getUser(payload.sub);
  }
}
