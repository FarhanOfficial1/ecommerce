import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './Admin.Entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private userRepository: Repository<AdminEntity>,
  ) {}

  async insertData(userEntity: AdminEntity) {
    return this.userRepository.insert(userEntity);
  }

  async selectData() {
    return this.userRepository.find({
      order:{
        id:'ASC'
      }
    });
  }

  findByName(userName:string){
    return this.userRepository.findOne({where :{name:userName}});
  }
}
