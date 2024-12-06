import { Module } from '@nestjs/common';
import { EmpService } from './e.service';
import { EmpController } from './e.controller';
import { EmpDto } from './e.dto';
import { AuthLocalStrategy } from './Authentication/auth.1local';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtTokens } from './Authentication/auth.2jwt.tokens';
import { AuthJwtStrategy } from './Authentication/auth3.jwt';
import { EmpRoleBasedGuard } from './Guard/e.4rolebased';

@Module({
  imports: [JwtModule.register({
    secret:"key",
    signOptions:{
      expiresIn:"60s"
    }
  })],
  controllers: [EmpController],
  providers: [EmpService,EmpDto,AuthLocalStrategy,AuthJwtTokens,AuthJwtStrategy,EmpRoleBasedGuard],
})
export class EmpModule {
  constructor(){
    console.log("Running Employee Module")
  }
}

