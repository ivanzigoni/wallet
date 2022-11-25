import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from 'src/accounts/interfaces/accounts.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
    comment: "User's @ identification",
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    comment: "User's hashed password",
  })
  password: string;

  @OneToMany(() => Account, (account) => account.user)
  account: Account;

  @BeforeInsert()
  private hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
  }

  @BeforeUpdate()
  private hashPasswordBeforeUpdate() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
  }
}
