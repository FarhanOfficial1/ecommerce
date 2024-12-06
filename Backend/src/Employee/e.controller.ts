import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmpService } from './e.service';
import { EmpDto } from './e.dto';
import { AuthJwtTokens } from './Authentication/auth.2jwt.tokens';
import { EmpRoleBasedGuard } from './Guard/e.4rolebased';
import { CONSTANTS } from './e.roles';

@Controller('employee')
export class EmpController {
  constructor(private readonly empService: EmpService,private readonly empJwt:AuthJwtTokens) {}

  //For normal Authentication using username and password
  // @Post('/login')
  // @UseGuards(AuthGuard('local'))
  // login(@Request() req): EmpDto {
  //   return req.user;
  // }

  //For Authentication and provide tokens
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req): string {
    const tokens=this.empJwt.generateTokens(req.user);
    return tokens
  }
  @Get('/select')
  @UseGuards(AuthGuard('local'))
  selectData(): EmpDto[] {
    return this.empService.getAllData();
  }

  @Get('/android')
  @UseGuards(AuthGuard('jwt'),new EmpRoleBasedGuard(CONSTANTS.ROLES.ANDROID_DEVELOPER))
  androidDeveloper(@Request() req): string {
    return JSON.stringify(req.user);
  }

  @Get('/web')
  @UseGuards(AuthGuard('jwt'),new EmpRoleBasedGuard(CONSTANTS.ROLES.WEB_DEVELOPER))
  webDeveloper(@Request() req): string {
    return req.user;
  }

}
