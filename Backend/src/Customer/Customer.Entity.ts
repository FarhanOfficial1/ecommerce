import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique, Index, CreateDateColumn } from 'typeorm';
import { OrderEntity } from '../Order/Order.Entity';

@Entity('Customer')
@Unique(['email']) // Ensure unique email for each customer
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  @Index()
  address: string;

  @Column()
  email: string;

  @CreateDateColumn({ type: 'date' })
  registrationDate: Date;

  @Column()
  @Index()
  contactDetail: string; // Consider changing this to string if phone numbers are expected

  @OneToMany(() => OrderEntity, (order) => order.customer, {
    cascade: true, // Cascade operations (insert/update/delete) to orders
  })
  orders: OrderEntity[];
}
