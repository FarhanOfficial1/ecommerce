import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { CustomerEntity } from '../Customer/Customer.Entity';
import { OrderItemsEntity } from '../OrderItems/OrderItem.Entity';

@Entity('Orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    onDelete: 'CASCADE', // Delete all orders when a customer is deleted
  })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column()
  customerId: number;

  @CreateDateColumn()
  orderDate: Date;

  // @Column({ length: 50 })
  // status: string; // e.g., 'Pending', 'Shipped', 'Delivered'

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => OrderItemsEntity, (orderItem) => orderItem.order, {
    cascade: true, // Automatically handle insert/update/delete for related order items
  })
  orderItems: OrderItemsEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalAmount() {
    console.log('Order Items:', this.orderItems); // Log the order items
    if (this.orderItems && this.orderItems.length > 0) {
      this.totalAmount = this.orderItems.reduce((sum, item) => {
        console.log('Item totalPrice:', item.totalPrice); // Log totalPrice for each item
        return sum + item.totalPrice;
      }, 0);
    } else {
      this.totalAmount = 0; // Ensure totalAmount is set to 0 if no order items are present
    }
    console.log('Calculated totalAmount:', this.totalAmount); // Log the final total amount
  }
}
