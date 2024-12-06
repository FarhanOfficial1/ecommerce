import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';;
import { OrderItemsEntity } from './OrderItem.Entity';
@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemRepository: Repository<OrderItemsEntity>,
  ) {}

  

}
