import { JwtService } from "@nestjs/jwt";
import { EmpDto } from "../e.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthJwtTokens{
    constructor(private readonly jwtService:JwtService){}
    generateTokens(employee:EmpDto):string{
        const palyoad={username:employee.username,password:employee.password,role:employee.role};
        return this.jwtService.sign(palyoad);
    }
}