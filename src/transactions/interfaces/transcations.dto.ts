import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class NewTransactionDto {
  @IsString()
  @MinLength(3)
  creditedAccountUsername: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
