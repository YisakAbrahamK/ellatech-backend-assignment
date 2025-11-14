import { Body, Controller, Post, Put, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { isUUID } from 'class-validator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with the provided details.',
    tags: ['Products'],
  })
  @ApiOkResponse({ description: 'The product has been successfully created.' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put('adjust')
  @ApiOperation({
    summary: 'Adjust product stock',
    description: 'Adjusts the stock quantity of a product.',
    tags: ['Products'],
  })
  @ApiOkResponse({
    description: 'The product stock has been successfully adjusted.',
  })
  async adjust(@Body() dto: AdjustProductDto) {
    return this.productsService.adjustStock(dto);
  }

  @Get('status/:productId')
  @ApiOperation({
    summary: 'Get product status',
    description: 'Retrieves the current status of a product by its ID.',
    tags: ['Products'],
  })
  @ApiOkResponse({
    description: 'The product status has been successfully retrieved.',
  })
  async status(@Param('productId') productId: string) {
    if (!isUUID(productId)) {
      throw new BadRequestException(`Invalid product ID: ${productId}`);
    }
    const product = await this.productsService.getStatus(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { status: 'ok', data: product };
  }
}
