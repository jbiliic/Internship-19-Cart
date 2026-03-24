import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return next.handle().pipe(
            map(data => ({
                statusCode,
                message: 'Success',
                data,
            })),
        );
    }
}