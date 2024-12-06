import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from '../Order/Order.Entity';
import { ProductEntity } from '../Product/Product.Entity';

@Entity('OrderItems')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE', // Delete order items when the parent order is deleted
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
    onDelete: 'SET NULL', // Retain order item even if the associated product is deleted
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ nullable: true }) // Allow null values for productId
  productId: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number; // Calculated as quantity * unitPrice
}
