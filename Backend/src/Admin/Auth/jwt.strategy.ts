import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException} from '@nestjs/common';
import { AdminService } from '../Admin.Service';
import { CreateAdminDto } from '../Admin.Dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super(
        {
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:"hello"
        });
  }

  
  async validate(payload: any): Promise<CreateAdminDto> {
      // Retrieve the user from the database using the name from the payload
      const user = await this.adminService.findByName(payload.username);
      
      // If the user does not exist, throw an unauthorized exception
      if (!user) {
          throw new UnauthorizedException('Admin not found');
        }
        
        // Return the user object, which will be set to req.user
        return user;
    }
}

//   validate(payload: any): any {
//     return payload;
//   }