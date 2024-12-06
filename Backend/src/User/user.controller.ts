import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDTo } from "./Dto/user.dto";
import { Users } from "./Entity/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { TokenGenerate } from "./Auth/token.generate";
import { AuthRoleBasedGuard } from "./Guard/auth.rolebased";
import { CONSTANTS } from "./user.role";
import { ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("users")
export class UserController{
    constructor(private readonly userService:UserService,private readonly tokens:TokenGenerate){}

    @Post("/login/aut")
    @UseGuards(AuthGuard("local"))
    login(@Request() req) {
        const t=this.tokens.tokenGenerator(req.user);
        return t;
    }  

    @Post("/insert")
    @UseGuards(AuthGuard("jwt"),new AuthRoleBasedGuard(CONSTANTS.ROLES.NORMAL_ROLE))
    insertData(@Body(ValidationPipe) userDto:UserDTo){
        return this.userService.insertData(userDto);
    }

    @Get("/select")
    @UseGuards(AuthGuard("jwt"),new AuthRoleBasedGuard(CONSTANTS.ROLES.NORMAL_ROLE))
    getAllData():Promise<Users[]>{
        return this.userService.findAll();
    }

    @Put("update/:id")
    updateData(@Param('id') id:string,@Body() userDto:UserDTo):string{
        this.userService.updateData(+id,userDto);
        return "Updated"
    }
    
    @Delete("/delete/:id")
    deleteData(@Param("id") id:number){
        return this.userService.deleteData(id);
    }

    
}