import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './Product.Entity';
import { ProductController } from './Product.Controller';
import { ProductService } from './Product.Service';

@Module({
  imports: [
    forwardRef(() => ProductEntity),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService,TypeOrmModule],
})
export class ProductModule {}
