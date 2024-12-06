import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";

@Entity()
export class Todos{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    title:string;
    @Column()
    date:string;
    @Column()
    completed:boolean;
    @ManyToOne(()=>Users,(users)=>users.todos)
    users:Users;
}