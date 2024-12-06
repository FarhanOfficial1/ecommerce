import { JwtService } from "@nestjs/jwt";
import { Users } from "../Entity/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenGenerate {
  constructor(private readonly jwtToken: JwtService) {}

  tokenGenerator(user: Users): string {
    // Ensure user has the properties you're expecting
    const payload = { username: user.name, password: user.password };
    return this.jwtToken.sign(payload);
  }
}