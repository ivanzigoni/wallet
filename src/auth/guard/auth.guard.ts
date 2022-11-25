import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import env from '../../common/config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    if (!request.headers.authorization) {
      throw new ForbiddenException('User must be logged in');
    }

    if (!request.headers.authorization.includes('Bearer')) {
      throw new ForbiddenException('User must be logged in');
    } else {
      const token = request.headers.authorization.split('Bearer')[1].trim();

      try {
        jwt.verify(token, env.JWT_SECRET);
      } catch (e) {
        throw new ForbiddenException('Invalid token');
      }
    }
    return true;
  }
}
