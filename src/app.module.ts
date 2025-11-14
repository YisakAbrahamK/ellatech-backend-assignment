import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDataSource } from './data-source';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HealthService } from './health.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService available everywhere
    }),
    TypeOrmModule.forRoot(createDataSource(new ConfigService()).options),
    UsersModule,
    ProductsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  // Only the root-level services belong here. Feature services are provided in their own modules.
  providers: [AppService, HealthService],
})
export class AppModule {}
