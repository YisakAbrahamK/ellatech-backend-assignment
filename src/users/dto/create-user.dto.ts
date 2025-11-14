import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Yisak Abraham', description: 'Name of the user' })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'yisak.abraham@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password for the user account',
  })
  password: string;
}
