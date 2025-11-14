import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the provided details.',
    tags: ['Users'],
  })
  @Post()
  @ApiOkResponse({ description: 'The user has been successfully created.' })
  async create(@Body() dto: CreateUserDto) {
    const exists = await this.usersService
      .findAll()
      .then((users) => users.find((user) => user.email === dto.email));
    if (exists) throw new ConflictException('Email already exists');
    const user = await this.usersService.create(dto);
    return user;
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users.',
    tags: ['Users'],
  })
  @Get()
  @ApiOkResponse({ description: 'List of all users retrieved successfully.' })
  async findAll() {
    return this.usersService.findAll();
  }
}
