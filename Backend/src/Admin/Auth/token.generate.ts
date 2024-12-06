import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { AdminEntity } from "../Admin.Entity";

@Injectable()
export class TokenGenerate {
  constructor(private readonly jwtToken: JwtService) {}

  tokenGenerator(admin: AdminEntity): string {
    // Ensure user has the properties you're expecting
    const payload = { username: admin.name, password: admin.password };
    return this.jwtToken.sign(payload);
  }
}