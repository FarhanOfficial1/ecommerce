import { IsBoolean, IsInt, IsString } from "class-validator";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TodoDto{
    @IsString()
    title:string;
}