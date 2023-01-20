import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SigninUserDto } from "../users/dto/signin-user";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(user: SigninUserDto): Promise<any> {
    const existedUser = await this.authService.validateUser(user);
    if (!existedUser) {
      throw new UnauthorizedException();
    }
    return user;
  }
}