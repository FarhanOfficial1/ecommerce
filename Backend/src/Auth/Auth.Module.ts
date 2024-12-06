import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './Auth.Entity';
import { AuthController } from './Auth.Controller';
import { AuthService } from './Auth.Service';
import { AdminEntity } from 'src/Admin/Admin.Entity';
@Module({
  imports: [
    forwardRef(() => AuthEntity),
    TypeOrmModule.forFeature([AuthEntity,AdminEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
