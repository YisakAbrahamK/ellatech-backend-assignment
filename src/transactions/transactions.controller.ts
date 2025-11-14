import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of all transactions retrieved successfully.',
  })
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieves a list of all transactions.',
    tags: ['Transactions'],
  })
  async list() {
    const transactions = await this.txService.findAll();
    return { status: 'ok', data: transactions };
  }
}
