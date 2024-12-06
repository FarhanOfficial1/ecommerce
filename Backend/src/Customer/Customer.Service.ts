import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, QueryBuilder, Repository } from 'typeorm';
import { CustomerEntity } from './Customer.Entity';
import { CustomerDto } from './Customer.Dto';
import { OrderEntity } from 'src/Order/Order.Entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  //Insert Data
  async insertCustomers(
    customerDtos: CustomerDto[],
  ): Promise<CustomerEntity[]> {
    // Validate for duplicate emails before insertion
    for (const customerDto of customerDtos) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: customerDto.email },
      });

      if (existingCustomer) {
        throw new ConflictException(
          `Email ${customerDto.email} already in use`,
        );
      }
    }

    // If no conflicts, proceed to insert
    const customers = customerDtos.map((customerDto) => {
      const customer = new CustomerEntity();
      customer.fullName = customerDto.fullName;
      customer.address = customerDto.address;
      customer.email = customerDto.email;
      customer.registrationDate = customer.registrationDate || new Date();
      customer.contactDetail = customerDto.contactDetail;
      return customer;
    });

    return this.customerRepository.save(customers); // Insert all customers at once
  }

  //Fetch/Select Data
  findAll() {
    return this.customerRepository.find({
      order:{
        id:'ASC'
      }
    });
  }
  async getAllCustomersQuery(): Promise<CustomerEntity[]> {
    return this.customerRepository.query(
      'SELECT * FROM customers ORDER BY id ASC', // Sort by id in ascending order
    );
  }
  async getAllCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      order: {
        id: 'ASC',
        // fullName: 'ASC',
      },
    });
  }

  async findAllPageWise(page: string, limit: string) {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 15);

    // Validate that the values are valid numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new Error('Invalid pagination values.');
    }

    // Calculate skip (based on page number) and take (limit)
    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    // Fetch the paginated data
    const [customers, totalCount] = await this.customerRepository.findAndCount({
      skip,
      take,
      order: {
        id: 'ASC',
        fullName: 'ASC',
      },
    });

    return {
      customers,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  }

  //Delete Data
  // In your deleteCustomer method
  async deleteCustomer(id: number): Promise<void> {
    const orderDetails = await this.orderRepository.find({
      where: { id: id },
    });

    if (orderDetails.length > 0) {
      await this.orderRepository.remove(orderDetails); // Remove the related order details
    }

    const result = await this.customerRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Customer not found');
    }
  }

  //Update Data
  async updateCustomer(
    id: number,
    customerDto: CustomerDto,
  ): Promise<CustomerEntity> {
    try {
      console.log(`Attempting to find customer with id: ${id}`);
      let customer;
      try {
        customer = await this.customerRepository.findOneOrFail({
          where: { id },
        });
        console.log('Customer found:', customer); // Ensure the customer is not undefined
      } catch (err) {
        console.error(`Error: Customer with id ${id} not found.`);
        throw new Error('Customer not found');
      }

      // Ensure customerDto is not undefined or null and contains the necessary fields
      if (!customerDto || !customerDto.fullName) {
        console.error('Invalid data: Missing fullName in customerDto.');
        throw new Error('Invalid data: Missing fullName in customerDto.');
      }

      // Log the incoming customerDto for debugging
      console.log('Received customerDto:', customerDto);

      customer.fullName = customerDto.fullName;
      customer.address = customerDto.address;
      customer.email = customerDto.email;
      customer.registrationDate = customerDto.registrationDate; // Ensure this is a valid Date object
      customer.contactDetail = customerDto.contactDetail;

      const updatedCustomer = await this.customerRepository.save(customer);
      console.log('Customer updated:', updatedCustomer);
      return updatedCustomer;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Customer update failed');
    }
  }

  async countCustomers(): Promise<number> {
    return await this.customerRepository.count();
  }

  async countCustomersByRegistrationDate(): Promise<number> {
    const query = `
      SELECT COUNT(*) 
      FROM "Customer"
      WHERE "registrationDate" <= CURRENT_DATE;
    `;

    const result = await this.customerRepository.query(query);
    return parseInt(result[0].count, 10); // result[0].count will return the count as string, so parse it
  }

  //Today
  async countCustomersRegisteredToday(): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set the time to the end of the day

    // Use QueryBuilder to count the number of customers registered today
    const count = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.registrationDate >= :todayStart', { todayStart })
      .andWhere('customer.registrationDate <= :todayEnd', { todayEnd })
      .getCount();

    return count;
  }

  //Week
  async countCustomersRegisteredThisWeek(): Promise<number> {
    // Step 1: Get today's date and the start of the current week (Monday)
    const today = new Date();
    const currentDay = today.getDate();

    // Calculate the first day of the current week (Monday)
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(currentDay - today.getDay() + 1); // Set to Monday
    firstDayOfWeek.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)

    // Set today's date to the end of the day
    today.setHours(23, 59, 59, 999); // End of today

    // Step 2: Fetch customers who registered from Monday to today
    const customers = await this.customerRepository.find();

    // Step 3: Filter customers who registered between Monday and today
    const registeredThisWeek = customers.filter((customer) => {
      const registrationDate = new Date(customer.registrationDate);
      return registrationDate >= firstDayOfWeek && registrationDate <= today;
    });

    // Step 4: Return the count of customers
    return registeredThisWeek.length;
  }

  //Month
  async countCustomersRegisteredThisMonth(): Promise<number> {
    // Step 1: Get today's date and the start of the current month (1st of the month)
    const today = new Date();

    // Calculate the first day of the current month (1st day)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)

    // Set today's date to the end of the day
    today.setHours(23, 59, 59, 999); // End of today

    // Step 2: Fetch customers who registered from the 1st of the current month to today
    const customers = await this.customerRepository.find();

    // Step 3: Filter customers who registered between the start of the month and today
    const registeredThisMonth = customers.filter((customer) => {
      const registrationDate = new Date(customer.registrationDate);
      return registrationDate >= firstDayOfMonth && registrationDate <= today;
    });

    // Step 4: Return the count of customers
    return registeredThisMonth.length;
  }

  //Fetch customer and order
  async getCustomersWithOrders(): Promise<CustomerEntity[]> {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.orders', 'order') // Ensures only customers with orders are included
      .getMany();
  }

  //count total customer who placed at least one order
  async countTotalOrdersWithCustomer(): Promise<number> {
    const totalOrders = await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order') // Join the orders relation
      .getCount(); // Count the orders
    return totalOrders;
  }

  //count total orders
  async countTotalOrders(): Promise<number> {
    const totalOrders = await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order') // Join the orders relation
      .select('COUNT(order.id)', 'total') // Count orders
      .getRawOne();

    return parseInt(totalOrders.total, 10); // Return the total order count as a number
  }

  //Fetch All customers associated with orders and products and also return orders and products
  async getCustomerWithOrdersAndProducts(): Promise<CustomerEntity[]> {
    const customersWithOrders = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'order') // Join orders
      .leftJoinAndSelect('order.product', 'product') // Join products through order
      // .where('customer.id = :id', { id: customerId }) // Filter by customer ID
      .andWhere('order.id IS NOT NULL') // Ensure that customer has at least one order
      .orderBy('order.id', 'ASC') // Sort customers by id in ascending order
      .getMany();

    // If no orders exist, return an empty array or handle the response differently
    return customersWithOrders;
  }

  //select Total Products
  async countTotalProducts(): Promise<number> {
    const totalProducts = await this.customerRepository
      .createQueryBuilder('customer')
      .innerJoin('customer.orders', 'order') // Join the orders relation
      .innerJoin('order.product', 'product') // Join the product relation
      .select('COUNT(DISTINCT product.id)', 'totalProducts') // Count distinct products
      .getRawOne(); // Fetch the result as raw data
  
    return parseInt(totalProducts.totalProducts, 10);
  }
}
