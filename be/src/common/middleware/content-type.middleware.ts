import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const methodsWithBody = ['POST', 'PUT', 'PATCH'];
        if (methodsWithBody.includes(req.method)) {
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                throw new BadRequestException('Content-Type must be application/json');
            }
        }
        next();
    }
}