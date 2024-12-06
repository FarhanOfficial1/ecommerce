import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoDto } from "./Dto/todo.dto";

@Controller("todo")
export class TodoController{
    constructor(private readonly todoService:TodoService){}

    @Post("/insert/:id")
    insertData(@Body(ValidationPipe) todoDto:TodoDto,@Param("id") id:number){
        return this.todoService.insertData(todoDto,Number(id));
    }
    @Get("/selectnotcompleted/:id")
    getAllDataNotCompleted(@Param("id") id:number){
        return this.todoService.findAllTodosByUserNotCpmpleted(Number(id));
    }

    @Get("/selectcompleted/:id")
    getAllDataCompleted(@Param("id") id:number){
        return this.todoService.findAllTodosByUserCpmpleted(Number(id));
    }

    @Put("update/:id")
    updateData(@Param('id') id:string){
        return this.todoService.updateData(Number(id));

    }
    
    @Delete("/delete/:id")
    deleteData(@Param("id") id:number){
        return this.todoService.deleteData(Number(id));
    }
}