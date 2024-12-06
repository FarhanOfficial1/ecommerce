import { Injectable } from "@nestjs/common";
import { IsInt, IsString } from "class-validator";

@Injectable()
export class EmpDto{
    @IsInt()
    id:number;

    @IsString()
    username:string;

    @IsString()
    password:string;

    @IsString()
    role:string;
}