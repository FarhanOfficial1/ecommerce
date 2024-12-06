import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { EmpService } from '../e.service';
import { EmpDto } from '../e.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly empService: EmpService) {
    super(
        {
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:"key"
        });
  }

  
  async validate(payload: any): Promise<EmpDto> {
      // Retrieve the user from the database using the name from the payload
      const user = await this.empService.getEmpByName(payload.username);
      
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