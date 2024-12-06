import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
  } from '@nestjs/common';
import { OrderItemService } from './OrderItem.Service';
  
  @Controller('Orders')
  export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) {}


  }
  