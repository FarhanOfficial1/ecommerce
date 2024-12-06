import { Controller, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { UserDTo } from './Dto/user.dto';
import { CONSTANTS } from '../User/user.role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) 
    private readonly userRepository: Repository<Users>
  ) {}

  insertData(userDto: UserDTo): Promise<Users> {
    let users: Users = new Users();
    users.name = userDto.name;
    users.address = userDto.address;
    users.age = userDto.age;
    users.role=CONSTANTS.ROLES.NORMAL_ROLE;
    users.password=userDto.password;
    return this.userRepository.save(users);
  }

  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  findById(userId:number){
    return this.userRepository.findOne({where :{id:userId}});
  }

  findByName(userName:string){
    return this.userRepository.findOne({where :{name:userName}});
  }
  
  deleteData(id: number) {
    return this.userRepository.delete(id);
  }

  updateData(id: number, userDto: UserDTo) {
    let users: Users = new Users();
    users.name = userDto.name;
    users.address = userDto.address;
    users.age = userDto.age;
    users.password=userDto.password;
    users.id = id;
    this.userRepository.save(users);
  }
}
