import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { User } from "../entity/User";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.authService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
