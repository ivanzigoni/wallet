import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/interfaces/users.dto';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './interfaces/login.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginCredentials: LoginCredentialsDto) {
    return this.authService.login(loginCredentials);
  }

  @Post('signup')
  async signUp(@Body() newUserDto: CreateUserDto) {
    return this.authService.signUp(newUserDto);
  }
}
