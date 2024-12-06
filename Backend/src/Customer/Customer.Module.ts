import {forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './Customer.Entity';
import { CustomerController } from './Customer.Controller';
import { CustomerService } from './Customer.Service';
import { OrderEntity } from '../Order/Order.Entity';
import { ProductEntity } from 'src/Product/Product.Entity';

@Module({
  imports: [
    // forwardRef(() => CustomerEntity),
    TypeOrmModule.forFeature([CustomerEntity,OrderEntity,ProductEntity]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports:[CustomerService,TypeOrmModule],
})
export class CustomerModule {}
