import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './Order.Service';
import { OrderController } from './Order.Controller';
import { CustomerModule } from 'src/Customer/Customer.Module';
import { ProductModule } from 'src/Product/Product.Module';
import { OrderEntity } from './Order.Entity';
import { OrderItemsEntity } from 'src/OrderItems/OrderItem.Entity';

@Module({
  imports: [
    forwardRef(() => OrderEntity),CustomerModule,ProductModule,
    TypeOrmModule.forFeature([OrderEntity,OrderItemsEntity])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
