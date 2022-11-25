import { User } from 'src/users/interfaces/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'accounts',
})
export class Account {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'balance',
    type: 'int',
    comment: "Account's balance in cents",
    nullable: false,
  })
  balance: number;

  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
