import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/User/user.service';
import { UserDTo } from 'src/User/Dto/user.dto';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserDTo> {
    const name: UserDTo = await this.userService.findByName(username);

    // Check if user exists
    if (!name) {
      throw new UnauthorizedException('User not found');
    }

    // Check if password matches
    if (name.password !== password) {
      throw new UnauthorizedException('Password does not match');
    }

    // If validation is successful, return the user object
    return name;
  }
}