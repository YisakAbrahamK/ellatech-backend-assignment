import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

export enum TransactionType {
  ADJUSTMENT = 'ADJUSTMENT',
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
}

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'integer' })
  delta: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  // Product relation
  @ManyToOne(() => Product, (product) => product.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Index()
  @Column()
  productId: string;

  // Optional user relation
  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Index()
  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
