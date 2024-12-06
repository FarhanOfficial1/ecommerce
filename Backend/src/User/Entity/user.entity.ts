import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todos } from './todo.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  age: number;
  @Column()
  role: string;

  @Column()
  password: string;

  @OneToMany(() => Todos, (todos) => todos.users)
  todos: Todos[];
}
