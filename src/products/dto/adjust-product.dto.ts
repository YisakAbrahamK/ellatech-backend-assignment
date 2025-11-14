import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'DeltaNotZero', async: false })
class DeltaNotZero implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return value !== 0; // delta must not be zero
  }
}

export class AdjustProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12345', description: 'ID of the product' })
  productId: string;

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @Validate(DeltaNotZero)
  @Min(-9999999) // reasonable lower bound
  @ApiProperty({
    example: 10,
    description: 'Amount to adjust the product quantity by',
  })
  delta: number; // positive = increase, negative = decrease

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '67890',
    description: 'ID of the user making the adjustment',
  })
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Adjustment note',
    description: 'Note about the adjustment',
  })
  note?: string;
}
