import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './interfaces/users.dto';
import { User } from './interfaces/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private accountsService: AccountsService,
  ) {}

  public async findOneOrThrow(where: { [key: string]: string | number }) {
    try {
      const user = await this.usersRepo.findOneOrFail({ where });
      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  public async createUser(userDto: CreateUserDto) {
    const { username, password } = userDto;

    try {
      await this.findOneOrThrow({ username });
    } catch (e) {
      const newUser = this.usersRepo.create({
        username,
        password,
      });

      const savedUser = await this.usersRepo.save(newUser);

      await this.accountsService.createAccount(savedUser);

      return savedUser;
    }

    throw new ForbiddenException('User already exists');
  }
}
