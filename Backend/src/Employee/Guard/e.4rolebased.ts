import { CanActivate, ExecutionContext } from "@nestjs/common";

export class EmpRoleBasedGuard implements CanActivate{
    private rolePassed:string
    constructor(role:string){
        this.rolePassed=role
    }
    canActivate(context: ExecutionContext): boolean{
        const tx=context.switchToHttp()
        const request:any=tx.getRequest<Request>()
        return this.rolePassed===request.user.role
    }
}