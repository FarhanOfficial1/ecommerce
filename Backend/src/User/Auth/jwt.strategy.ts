import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { UserService } from '../user.service';
import { UserDTo } from '../Dto/user.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super(
        {
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:"give"
        });
  }

  
  async validate(payload: any): Promise<UserDTo> {
      // Retrieve the user from the database using the name from the payload
      const user = await this.userService.findByName(payload.username);
      
      // If the user does not exist, throw an unauthorized exception
      if (!user) {
          throw new UnauthorizedException('User not found');
        }
        
        // Return the user object, which will be set to req.user
        return user;
    }
}

//   validate(payload: any): any {
//     return payload;
//   }