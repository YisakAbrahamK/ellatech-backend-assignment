import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '12345', description: 'ID of the product' })
  productId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '67890', description: 'ID of the user' })
  userId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 10,
    description: 'Number of transactions to retrieve',
  })
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 0, description: 'Number of transactions to skip' })
  offset?: number;
}
