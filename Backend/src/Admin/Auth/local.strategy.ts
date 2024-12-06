import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../Admin.Service';
import { CreateAdminDto } from '../Admin.Dto';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  async validate(username: string, password: string): Promise<CreateAdminDto> {
    const name: CreateAdminDto = await this.adminService.findByName(username);

    // Check if user exists
    if (!name) {
      throw new UnauthorizedException('Admin not found');
    }

    // Check if password matches
    if (name.password !== password) {
      throw new UnauthorizedException('Password does not match');
    }

    // If validation is successful, return the user object
    return name;
  }
}