import {
  applyDecorators,
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { type FastifyRequest } from 'fastify';
import { JwtPayload, verify } from 'jsonwebtoken';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export class IdentifyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpArgumentsHost = context.switchToHttp();

    const request = httpArgumentsHost.getRequest<FastifyRequest>();
    const token = request.headers.authorization?.slice('Bearer '.length);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = verify(token, 'secret');
      request.user = payload as JwtPayload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

export const VerifyUserIdentity = applyDecorators(UseGuards(IdentifyGuard));
export const CurrentUser = createParamDecorator(
  (propKey: keyof JwtPayload, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    if (!req.user) {
      throw new RuntimeException('Missing verify IdentifyGuard');
    }

    return propKey ? req.user[propKey] : req.user;
  },
);
