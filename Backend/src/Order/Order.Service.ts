import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './Order.Entity';
import { OrderItemsEntity } from 'src/OrderItems/OrderItem.Entity';
import { CreateOrderDto } from './Order.Dto';
import { CustomerEntity } from 'src/Customer/Customer.Entity';
import { ProductEntity } from 'src/Product/Product.Entity';
import { UpdateOrderDto } from './UpdateOrderDto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemsRepository: Repository<OrderItemsEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  //Select All Orders with pagination
  async getAllOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: OrderEntity[]; total: number; pageCount: number }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      relations: ['customer', 'orderItems', 'orderItems.product'],
      order: { orderDate: 'ASC' }, // Ensure sorting of the orders
      skip: (page - 1) * limit, // Skip the appropriate number of records
      take: limit, // Limit the number of records returned
    });

    const pageCount = Math.ceil(total / limit); // Calculate total pages based on the total records

    return { data: orders, total, pageCount };
  }

  //total amount today
  async getTotalAmountForToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalAmount')
      .where('order.orderDate >= :today AND order.orderDate < :tomorrow', {
        today,
        tomorrow,
      })
      .getRawOne();

    return result.totalAmount || 0; // Return 0 if no orders
  }

  //total amount week
  async getTotalAmountForWeek(): Promise<number> {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Get Sunday of the current week
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Saturday of the current week
    endOfWeek.setHours(23, 59, 59, 999);

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfWeek,
        end: endOfWeek,
      })
      .getRawOne();

    return parseFloat(result.total) || 0; // Ensure a number is returned
  }

  //total amount month
  async getTotalAmountForMonth(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ); // Last day of the current month

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      })
      .getRawOne();

    return parseFloat(result.total) || 0; // Ensure a number is returned
  }

  //total amount year
  async getTotalAmountForYear(): Promise<number> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of the current year
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st of the current year

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfYear,
        end: endOfYear,
      })
      .getRawOne();

    return parseFloat(result.total) || 0; // Ensure a number is returned
  }

  // Search
  async getOrders(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[OrderEntity[], number]> {
    const skip = (page - 1) * limit;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere(
        '(CAST(order.id AS TEXT) LIKE :search OR customer.fullName LIKE :search OR product.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, count] = await query.getManyAndCount();
    return [data, count];
  }

  async getalll() {
    return this.orderRepository.count();
  }

  // Method to count the total number of orders
  async countAllById(): Promise<number> {
    return this.orderRepository.count({
      where: {
        id: Not(null), // Ensures it counts rows where `id` is not null
      },
    });
  }

  // Get a Specific Order by ID
  async getOrderById(id: number): Promise<OrderEntity> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });
  }

  //Insert
  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const { customerId, orderItems, orderDate } = createOrderDto;

    // Validate if the customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} does not exist.`);
    }

    // Fetch product details using product names provided in orderItems
    const products = await this.productRepository.find({
      where: { name: In(orderItems.map((item) => item.productName)) },
    });

    if (products.length !== orderItems.length) {
      throw new Error('One or more products are invalid.');
    }

    // Map the order items to include the productId, unitPrice, etc.
    const itemsWithDetails = orderItems.map((item) => {
      const product = products.find((p) => p.name === item.productName);
      if (!product) {
        throw new Error(`Product ${item.productName} does not exist.`);
      }
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity,
      };
    });

    const orderItemsEntities = itemsWithDetails.map((item) => {
      const orderItem = new OrderItemsEntity();
      orderItem.productId = item.productId;
      orderItem.quantity = item.quantity;
      orderItem.unitPrice = item.unitPrice;
      orderItem.totalPrice = item.totalPrice;
      return orderItem;
    });

    // Check if the order date is in the future
    if (orderDate && new Date(orderDate) > new Date()) {
      throw new Error('Order date cannot be in the future.');
    }

    // Use the provided order date or the current date
    const finalOrderDate = orderDate ? new Date(orderDate) : new Date();

    // Create the order entity
    const order = this.orderRepository.create({
      customerId,
      orderDate: finalOrderDate,
      orderItems: orderItemsEntities,
    });

    // Save and return the order
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number) {
    return this.orderRepository.delete(id);
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'], // Ensure we load the order items
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    // Update customer if provided in the DTO
    if (updateOrderDto.customerId) {
      order.customerId = updateOrderDto.customerId;
    }

    // Update order date if provided in the DTO
    if (updateOrderDto.orderDate) {
      order.orderDate = updateOrderDto.orderDate; // Update the order date
    }

    // Update order items if provided
    if (updateOrderDto.orderItems && updateOrderDto.orderItems.length > 0) {
      // Clear existing order items
      order.orderItems = [];

      // Map and create the updated order items
      for (const itemDto of updateOrderDto.orderItems) {
        // Fetch product details based on productId
        const product = await this.productRepository.findOne({
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new Error(
            `Product with ID ${itemDto.productId} does not exist.`,
          );
        }

        // Calculate the unitPrice and totalPrice
        const unitPrice = product.price;
        const totalPrice = unitPrice * itemDto.quantity;

        const orderItem = new OrderItemsEntity();
        orderItem.productId = itemDto.productId; // productId is set
        orderItem.quantity = itemDto.quantity;
        orderItem.unitPrice = unitPrice; // unitPrice is automatically set
        orderItem.totalPrice = totalPrice; // totalPrice is automatically calculated

        // Save the updated order item
        order.orderItems.push(orderItem);
      }
    }

    // Recalculate the totalAmount after updating order items
    await order.calculateTotalAmount(); // Recalculate the total amount

    // Save the updated order
    return await this.orderRepository.save(order);
  }

  async countOrdersToday(): Promise<number> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
  
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'count')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getRawOne();
  
    return parseInt(result.count, 10) || 0; // Return the count as a number
  }

  async countOrdersThisWeek(): Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6,
      23,
      59,
      59,
      999,
    );
  
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'count')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfWeek,
        end: endOfWeek,
      })
      .getRawOne();
  
    return parseInt(result.count, 10) || 0; // Return the count as a number
  }

  async countOrdersThisMonth(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'count')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      })
      .getRawOne();
  
    return parseInt(result.count, 10) || 0; // Return the count as a number
  }

  async countOrdersThisYear(): Promise<number> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st, start of the year
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st, end of the year
  
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'count')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfYear,
        end: endOfYear,
      })
      .getRawOne();
  
    return parseInt(result.count, 10) || 0; // Return the count as a number
  }
  

  //for chart
  async getSalesDataThisYear(): Promise<any> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st, start of the year
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st, end of the year
  
    // Assuming your orderDate and totalAmount are stored as Date and Decimal in your database
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.orderDate)', 'month')
      .addSelect('SUM(order.totalAmount)', 'totalSales')
      .where('order.orderDate BETWEEN :start AND :end', {
        start: startOfYear,
        end: endOfYear,
      })
      .groupBy('month')
      .orderBy('month')
      .getRawMany();
  
    // Format the data for charting
    return result.map((row) => ({
      month: row.month,
      totalSales: parseFloat(row.totalSales),
    }));
  }
  
}
