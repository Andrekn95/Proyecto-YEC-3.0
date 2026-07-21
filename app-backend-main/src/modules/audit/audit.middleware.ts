import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { auditNamespace, setCurrentUser } from '@modules/audit/audit-context';
import { PayloadTokenInterface } from 'src/modules/auth/interfaces';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next();
    }

    const [, token] = req.headers.authorization.split(' ');

    try {
      const payload = this.jwtService.decode(token) as PayloadTokenInterface;

      auditNamespace.run(() => {
        setCurrentUser({ id: payload.sub });
        next();
      });
    } catch {
      next();
    }
  }
}
