import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto';
import {
  Transaction,
  TransactionType,
} from '../transactions/transaction.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async getStatus(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // async adjustStock(dto: AdjustProductDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const product = await queryRunner.manager.findOne(Product, {
  //       where: { id: dto.productId },
  //       lock: { mode: 'pessimistic_write' },
  //     });
  //     if (!product) throw new NotFoundException('Product not found');

  //     const newQty = product.quantity + dto.delta;
  //     if (newQty < 0) throw new BadRequestException('Insufficient stock');

  //     product.quantity = newQty;
  //     await queryRunner.manager.save(product);

  //     const tx = queryRunner.manager.create(Transaction, {
  //       productId: product.id,
  //       userId: dto.userId,
  //       delta: dto.delta,
  //       type: TransactionType.ADJUSTMENT,
  //       note: dto.note,
  //     });
  //     await queryRunner.manager.save(tx);

  //     await queryRunner.commitTransaction();
  //     return { product, transaction: tx };
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  async adjustStock(dto: AdjustProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: dto.productId },
        lock: { mode: 'pessimistic_write' }, // prevent concurrent conflicts
      });
      if (!product) throw new NotFoundException('Product not found');

      const newQuantity = product.quantity + dto.delta;
      if (newQuantity < 0) throw new BadRequestException('Insufficient stock');

      product.quantity = newQuantity;
      await queryRunner.manager.save(product);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: dto.userId },
      });
      if (!user) throw new NotFoundException('User not found');

      const tx = queryRunner.manager.create(Transaction, {
        product,
        user,
        delta: dto.delta,
        type: dto.delta > 0 ? TransactionType.PURCHASE : TransactionType.SALE,
        note: dto.note,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return { product, transaction: tx };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
