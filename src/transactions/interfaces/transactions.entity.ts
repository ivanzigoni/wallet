import { Account } from 'src/accounts/interfaces/accounts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'transactions',
})
export class Transaction {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'value',
    type: 'int',
    comment: 'Transferred amount in the transaction in cents',
    nullable: false,
  })
  value: number;

  @ManyToOne((_) => Account)
  @JoinColumn({
    name: 'debited_account_id',
  })
  debitedAccount: Account;

  @ManyToOne((_) => Account)
  @JoinColumn({
    name: 'credited_account_id',
  })
  creditedAccount: Account;

  @CreateDateColumn()
  createdAt: Date;
}
