import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REAL_IN_CENT } from 'src/common/constants/cent-to-real';
import { Transaction } from 'src/transactions/interfaces/transactions.entity';
import { User } from 'src/users/interfaces/users.entity';
import { Repository } from 'typeorm';
import { Account } from './interfaces/accounts.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountsRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionsRepo: Repository<Transaction>,
  ) {}

  public async createAccount(user: User) {
    const newAccount = this.accountsRepo.create({
      balance: 100 * REAL_IN_CENT.One,
      user,
    });

    const savedAccount = await this.accountsRepo.save(newAccount);

    await this.transactionsRepo.save(
      this.transactionsRepo.create({
        creditedAccount: savedAccount,
        value: 100 * REAL_IN_CENT.One,
      }),
    ); // initial balance transaction so it doesn't break the updateBalance function below
  }

  public async findOneOrThrow(username: string, relations: string[] = []) {
    try {
      const account = await this.accountsRepo.findOneOrFail({
        where: { user: { username } },
        relations,
      });
      return account;
    } catch (e) {
      throw new NotFoundException('No account balance found for this email');
    }
  }

  public async checkBalanceForCashOut(username: string, value: number) {
    const account = await this.findOneOrThrow(username);

    if (account.balance - value < 0) {
      throw new ForbiddenException('Insufficient funds');
    } else {
      return account;
    }
  }

  public async updateAccountBalance(account: Account) {
    const { id } = account;

    const { totalCredited } = await this.transactionsRepo
      .createQueryBuilder('t')
      .select('SUM(value)', 'totalCredited')
      .leftJoin('t.creditedAccount', 'creditedAccount')
      .where('creditedAccount.id = :id', {
        id,
      })
      .getRawOne();

    const { totalDebited } = await this.transactionsRepo
      .createQueryBuilder('t')
      .select('SUM(t.value)', 'totalDebited')
      .leftJoin('t.debitedAccount', 'debitedAccount')
      .where('debitedAccount.id = :id', { id })
      .getRawOne();

    account.balance = Number(totalCredited) - Number(totalDebited);

    await this.accountsRepo.save(account);
  }
}
