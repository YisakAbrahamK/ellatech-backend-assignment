import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  // Each module that needs repositories must import them explicitly via TypeOrmModule.forFeature
  imports: [TypeOrmModule.forFeature([Product, Transaction])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
