import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todos } from './Entity/todo.entity';
import { TodoDto } from './Dto/todo.dto';
import { UserService } from './user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todos) private readonly todoRepository: Repository<Todos>,
    private readonly userService: UserService,
  ) {}

  async insertData(todoDto: TodoDto, userId: number): Promise<Todos> {
    let todos: Todos = new Todos();
    todos.title = todoDto.title;
    todos.date = new Date().toLocaleString();
    todos.completed = false;
    todos.users = await this.userService.findById(userId);
    return this.todoRepository.save(todos);
  }

  findAllTodosByUserNotCpmpleted(userId: number): Promise<Todos[]> {
    return this.todoRepository.find({
      relations: ['users'],
      where: { users: { id: userId }, completed: false },
    });
  }

  findAllTodosByUserCpmpleted(userId: number): Promise<Todos[]> {
    return this.todoRepository.find({
      relations: ['users'],
      where: { users: { id: userId }, completed: true },
    });
  }
  deleteData(id: number) {
    return this.todoRepository.delete(id);
  }

  updateData(id: number) {
    this.todoRepository.update(id, { completed: true });
  }
}
