import { Injectable } from "@nestjs/common";
import { IsInt, IsNumber, IsString } from "class-validator";

export class UserDTo{
    @IsString()
    name:string;
    @IsString()
    address:string;
    @IsInt()
    age:number;
    @IsString()
    password:string;
}