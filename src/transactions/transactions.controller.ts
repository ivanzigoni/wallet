import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { TransactionsFiltersDto } from './interfaces/transactions.filters.dto';
import { NewTransactionDto } from './interfaces/transcations.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async newTransaction(
    @User() username: string,
    @Body() newTransactionDto: NewTransactionDto,
  ) {
    return this.transactionsService.newTransaction(username, newTransactionDto);
  }

  @Get()
  async getTransactions(
    @User() username: string,
    @Query() filters: TransactionsFiltersDto,
  ) {
    return this.transactionsService.getTransactions(username, filters);
  }
}
