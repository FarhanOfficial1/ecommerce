import { Injectable } from '@nestjs/common';
import { EmpDto } from './e.dto';
import { CONSTANTS } from './e.roles';

@Injectable()
export class EmpService {
  public emp: EmpDto[] = [
    {
      id: 1,
      username: 'farhan',
      password: '1234',
      role: CONSTANTS.ROLES.WEB_DEVELOPER,
    },
    {
    id: 1,
      username: 'farhan',
      password: '7777',
      role: CONSTANTS.ROLES.WEB_DEVELOPER,
    },
    {
      id: 2,
      username: 'Vinay',
      password: '4321',
      role: CONSTANTS.ROLES.ANDROID_DEVELOPER,
    },
  ];

  getEmpByName(username:string):EmpDto{
    return this.emp.find((e)=>e.username===username);
  }

  getAllData():EmpDto[]{
    return this.emp;
  }
}
