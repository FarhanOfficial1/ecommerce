import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction } from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Global MiddleWare
// function middleWare(req:Request,res:Response,next:NextFunction){
//   console.log("Middle Ware Run")
//   next()
// }
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Use of Global MiddleWare
  // app.use(middleWare) 
  // Use Global Gaurds
  // app.useGlobalGuards(new EmpGuard())
  app.enableCors();
  const options=new DocumentBuilder()
  .setTitle("OMS")
  .setDescription("OMS NestApp Rest API's")
  .setVersion("1.0")
  .addBearerAuth({
    type:"http",
    scheme:"bearer",
    bearerFormat:"JWT",
    name:"JWT",
    description:"Enter JWT Token",
    in:"header"
  },"JWT-auth").build();
  const document=SwaggerModule.createDocument(app,options);
  SwaggerModule.setup("api",app,document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
