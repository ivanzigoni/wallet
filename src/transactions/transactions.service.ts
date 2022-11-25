import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Repository } from 'typeorm';
import { Transaction } from './interfaces/transactions.entity';
import { TransactionsFiltersDto } from './interfaces/transactions.filters.dto';
import { NewTransactionDto } from './interfaces/transcations.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private accountsService: AccountsService,
  ) {}

  public async newTransaction(
    debitedAccountUsername: string,
    transactionDto: NewTransactionDto,
  ) {
    const { value, creditedAccountUsername } = transactionDto;

    if (creditedAccountUsername === debitedAccountUsername) {
      throw new ForbiddenException('Cannot cashout for yourself');
    }

    const debitedAccount = await this.accountsService.checkBalanceForCashOut(
      debitedAccountUsername,
      value,
    );

    const creditedAccount = await this.accountsService.findOneOrThrow(
      creditedAccountUsername,
    );

    await this.transactionRepo.save(
      this.transactionRepo.create({
        creditedAccount,
        debitedAccount,
        value,
      }),
    );

    await Promise.all([
      this.accountsService.updateAccountBalance(creditedAccount),
      this.accountsService.updateAccountBalance(debitedAccount),
    ]);
  }

  public async getTransactions(
    username: string,
    filters: TransactionsFiltersDto,
  ) {
    const { transactionDate, transactionType } = filters;

    const transactionsList = await this.transactionRepo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.debitedAccount', 'debitedAccount')
      .leftJoinAndSelect('t.creditedAccount', 'creditedAccount')
      .leftJoinAndSelect('debitedAccount.user', 'debitedUser')
      .leftJoinAndSelect('creditedAccount.user', 'creditedUser')
      .where(transactionDate ? 't.createdAt = transactionDate' : '1=1', {
        transactionDate,
      })
      .getMany();

    const result =
      transactionType === 'ALL'
        ? transactionsList
        : transactionsList.filter((transaction: Transaction) => {
            if (transactionType === 'CASHOUT') {
              return (
                transaction.debitedAccount &&
                transaction.debitedAccount.user.username === username
              );
            } else if (transactionType === 'CASHIN') {
              return (
                transaction.creditedAccount &&
                transaction.creditedAccount.user.username === username
              );
            }
          });

    return this.serializeTransactions(result);
  }

  private serializeTransactions(transactions: Transaction[]) {
    return transactions.map((transaction: Transaction) => {
      const { value, createdAt } = transaction;
      return {
        value,
        createdAt,
      };
    });
  }
}
