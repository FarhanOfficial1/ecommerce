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
import { CustomerService } from './Customer.Service';
import { CustomerEntity } from './Customer.Entity';
import { CustomerDto } from './Customer.Dto';
import { validate } from 'class-validator';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('insert')
  async create(@Body() customerDto: CustomerDto[]): Promise<CustomerEntity[]> {
    return this.customerService.insertCustomers(customerDto);
  }

  @Put('update/:id')
  async updateData(@Body() customerDto: CustomerDto, @Param('id') id: number) {
    console.log('Received ID:', id);
    // Perform validation of customerDto here if not done elsewhere
    const errors = await validate(customerDto);
    if (errors.length > 0) {
      throw new Error('Validation failed');
    }

    return this.customerService.updateCustomer(id, customerDto);
  }

  @Get('select/getcustomer')
  async getAll() {
    return this.customerService.getAllCustomers();
  }

  @Delete('delete/:id')
  async deleteCustomer(@Param('id') id: number): Promise<void> {
    await this.customerService.deleteCustomer(id);
  }
  
  @Get('select/allpagewise')
  async getAllPageWise(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.customerService.findAllPageWise(page, limit);
  }

  @Get('select/count')
  async getCustomerCount(): Promise<number> {
    return this.customerService.countCustomers();
  }

  @Get('select/today')
  async getCountToday(): Promise<number> {
    return this.customerService.countCustomersRegisteredToday();
  }

  @Get('select/week')
  async getCountWeek(): Promise<number> {
    return this.customerService.countCustomersRegisteredThisWeek();
  }

  @Get('select/month')
  async getCountMonth(): Promise<number> {
    return this.customerService.countCustomersRegisteredThisMonth();
  }

  @Get('select/year')
  async getCustomerCountByRegistrationDate(): Promise<number> {
    return this.customerService.countCustomersByRegistrationDate();
  }

  //Fetch customer and order
  // @Get('select/with-orders')
  // async getCustomersWithOrders(): Promise<CustomerEntity[]> {
  //   return await this.customerService.getCustomersWithOrders();
  // }

  //count total customer who placed at least one order
  // @Get('select/counttotalcustomers')
  // async countorders() {
  //   return this.customerService.countTotalOrdersWithCustomer();
  // }

  //count total order in order entity
  // @Get('select/counttotalorders/today')
  // async totalOrders() {
  //   return this.customerService.countTotalOrders();
  // }




  // @Get('select/orders-with-products')
  // async getCustomerWithOrdersAndProducts(): Promise<CustomerEntity[]> {
  //   return this.customerService.getCustomerWithOrdersAndProducts();
  // }


  // @Get('/countproducts')
  // async countProducts(): Promise<number> {
    
  //   return this.customerService.countTotalProducts();
  // }
}
