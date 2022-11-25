import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './interfaces/transactions.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [TypeOrmModule.forFeature([Transaction]), AccountsModule],
})
export class TransactionsModule {}
