import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmpService } from '../e.service';
import { EmpDto } from '../e.dto';


@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly empService: EmpService) {
    super();
  }

  validate(username: string, password: string): EmpDto {
    const name: EmpDto = this.empService.getEmpByName(username);
    if (!name) {
      throw new UnauthorizedException('Empty credentials');
    }

    if (name.password !== password) {
      throw new UnauthorizedException('Password Not Matched');
    }
    return name;
  }
}
