import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const methodsWithBody = ['POST', 'PUT', 'PATCH'];
        if (methodsWithBody.includes(req.method)) {
            const contentLength = Number(req.headers['content-length'] ?? 0);
            const hasTransferEncoding = Boolean(req.headers['transfer-encoding']);
            const hasBody = contentLength > 0 || hasTransferEncoding;

            if (!hasBody) {
                next();
                return;
            }

            if (!req.is('application/json')) {
                throw new BadRequestException('Content-Type must be application/json');
            }
        }
        next();
    }
}