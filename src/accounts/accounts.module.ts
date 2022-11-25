import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './interfaces/accounts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/interfaces/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
