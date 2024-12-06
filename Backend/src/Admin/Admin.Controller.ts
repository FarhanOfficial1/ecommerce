import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './Admin.Service';
import { AdminEntity } from './Admin.Entity';
import { AuthGuard } from '@nestjs/passport';
import { TokenGenerate } from './Auth/token.generate';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private readonly tokens: TokenGenerate,
  ) {}

  @Post('insert/uinsert')
  async insertData(@Body() userEntity: AdminEntity) {
    await this.adminService.insertData(userEntity);
  }

  @Get('select/uall')
  // @UseGuards(AuthGuard("jwt"))
  async selectData() {
    return await this.adminService.selectData();
  }

  @Post('/auth/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req) {
    const t = this.tokens.tokenGenerator(req.user);
    return t;
  }
}
