import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsEntity } from './OrderItem.Entity';
import { OrderItemController } from './OrderItem.Controller';
import { OrderItemService } from './OrderItem.Service';
@Module({
  imports: [
    forwardRef(() => OrderItemsEntity),
    TypeOrmModule.forFeature([OrderItemsEntity])
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
