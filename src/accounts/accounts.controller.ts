import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('balance')
  async getBalance(@User() username: string) {
    return this.accountsService.findOneOrThrow(username);
  }
}
