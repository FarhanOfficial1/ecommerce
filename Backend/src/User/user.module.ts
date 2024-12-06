import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './Entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TodoService } from './todo.service';
import { Todos } from './Entity/todo.entity';
import { TodoController } from './todo.controller';
import { AuthLocalStrategy } from './Auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenGenerate } from './Auth/token.generate';
import { AuthJwtStrategy } from './Auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Todos]),
  JwtModule.register({
    secret:"give",
    signOptions:{
      expiresIn:"60s"
    }
  })
], 
  controllers: [UserController,TodoController],
  providers: [UserService,TodoService,AuthLocalStrategy,TokenGenerate,AuthJwtStrategy],
})
export class UserModule {
  constructor(){
    console.log("User Running")
  }
}

