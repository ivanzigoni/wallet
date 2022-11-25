import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/interfaces/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginCredentialsDto } from './interfaces/login.interface';
import * as bcrypt from 'bcrypt';
import env from '../common/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(credentials: LoginCredentialsDto) {
    const { username, password } = credentials;

    const foundUser = await this.userService.findOneOrThrow({ username });

    const pwIsValid = await bcrypt.compare(password, foundUser.password);

    if (pwIsValid) {
      const token = this.generateToken(username);

      return { token };
    } else {
      throw new ForbiddenException('Invalid credentials');
    }
  }

  public async signUp(newUser: CreateUserDto) {
    const { username } = await this.userService.createUser(newUser);

    const token = this.generateToken(username);

    return {
      token,
      username,
    };
  }

  private generateToken(username: string) {
    return this.jwtService.sign(
      { username },
      { expiresIn: '24h', secret: env.JWT_SECRET },
    );
  }
}
