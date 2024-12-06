import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './Admin.Entity';
import { AdminController } from './Admin.Controller';
import { AdminService } from './Admin.Service';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtStrategy } from './Auth/jwt.strategy';
import { AuthLocalStrategy } from './Auth/local.strategy';
import { TokenGenerate } from './Auth/token.generate';
@Module({
  imports: [
    // forwardRef(() => AuthEntity),
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret:"hello",
      signOptions:{
        expiresIn:"1hr"
      }
    })
  ],
  controllers: [AdminController],
  providers: [AdminService,AuthJwtStrategy,AuthLocalStrategy,TokenGenerate],
  exports: [AdminService],
})
export class AdminModule {}
