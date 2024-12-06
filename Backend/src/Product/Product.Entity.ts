import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { OrderItemsEntity } from '../OrderItems/OrderItem.Entity';

@Entity('Products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string; // URL or path to the product image

  @OneToMany(() => OrderItemsEntity, (orderItem) => orderItem.product, {
    cascade: ['insert', 'update'], // Cascade insert and update for related order items
  })
  orderItems: OrderItemsEntity[];
}
