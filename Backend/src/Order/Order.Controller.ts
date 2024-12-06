import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { OrderService } from './Order.Service';
import { OrderEntity } from './Order.Entity';
import { CreateOrderDto } from './Order.Dto';
import { UpdateOrderDto } from './UpdateOrderDto';

@Controller('Orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //count all orders
  @Get('countall')
  async all() {
    return this.orderService.getalll();
  }

  //Total Sale today,week,month,year
  @Get('total-amount/today')
  async getTotalAmountForToday(): Promise<number> {
    return this.orderService.getTotalAmountForToday();
  }

  @Get('total-amount/week')
  async getTotalAmountForWeek(): Promise<number> {
    return this.orderService.getTotalAmountForWeek();
  }

  @Get('total-amount/month')
  async getTotalAmountForMonth(): Promise<number> {
    return this.orderService.getTotalAmountForMonth();
  }

  @Get('total-amount/year')
  async getTotalAmountForYear(): Promise<number> {
    return this.orderService.getTotalAmountForYear();
  }

  @Get('select/all')
  async getAllOrders(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 items per page
  ): Promise<{ data: OrderEntity[]; total: number; pageCount: number }> {
    // Call the service method with page and limit
    return this.orderService.getAllOrders(page, limit);
  }

  @Get('select/searchall')
  async getOrders(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ): Promise<{ data: OrderEntity[]; pageCount: number }> {
    const [data, count] = await this.orderService.getOrders(
      page,
      limit,
      search,
    );
    return {
      data,
      pageCount: Math.ceil(count / limit),
    };
  }

  @Get('select/:id')
  async getOrderById(@Param('id') id: number): Promise<OrderEntity> {
    return this.orderService.getOrderById(id);
  }

  @Get('select/countbyid')
  async countAllById() {
    return await this.orderService.countAllById();
  }

  @Post('insert')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Delete('delete/:id')
  async deleteDta(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Put('update/:id')
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }

  //Total order today,week,month,year
  @Get('total-order/today')
  async countOrdersToday(): Promise<number> {
    return this.orderService.countOrdersToday();
  }

  @Get('total-order/week')
  async countOrdersThisWeek(): Promise<number> {
    return this.orderService.countOrdersThisWeek();
  }

  @Get('total-order/month')
  async countOrdersThisMonth(): Promise<number> {
    return this.orderService.countOrdersThisMonth();
  }

  @Get('total-order/year')
  async countOrdersThisYear(): Promise<number> {
    return this.orderService.countOrdersThisYear();
  }

  @Get('sales-year/chart')
  async getSalesThisYear(): Promise<any> {
    return this.orderService.getSalesDataThisYear();
  }
}
