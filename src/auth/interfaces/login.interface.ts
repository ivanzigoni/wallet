import { IsString, MinLength } from 'class-validator';

export class LoginCredentialsDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
