import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import env from '../../common/config';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;

    const {
      headers: { authorization },
    } = request;

    const token = authorization.split('Bearer')[1].trim();

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);

      return (request['username'] = payload['username']);
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  },
);
