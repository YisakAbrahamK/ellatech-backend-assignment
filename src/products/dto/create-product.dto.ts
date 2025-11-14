import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'This is a product description',
    description: 'Description of the product',
  })
  description?: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 100,
    description: 'Quantity of the product in stock',
  })
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 19.99,
    description: 'Price of the product',
  })
  price: number;
}
