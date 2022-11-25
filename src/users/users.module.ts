import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './interfaces/users.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  exports: [UsersService],
})
export class UsersModule {}
