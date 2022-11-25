import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum TYPE {
  CASH_IN = 'CASHIN',
  CASH_OUT = 'CASHOUT',
  ALL = 'ALL',
}

export class TransactionsFiltersDto {
  @IsDateString()
  @IsOptional()
  transactionDate: Date;

  @IsNotEmpty()
  @IsEnum(TYPE)
  transactionType: TYPE;
}
