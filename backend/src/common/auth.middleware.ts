import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const role = req.headers['x-user-role'];
        const email = req.headers['x-user-email'];
        if (!role || !email) {
            throw new UnauthorizedException('Missing x-user-role or x-user-email header');
        }
        // Attach user info to the request for later use
        req['user'] = { role, email };
        next();
    }
}
