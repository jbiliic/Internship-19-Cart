import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = "Internal server error";

        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            message = typeof res === 'object' ? (res as any).message : res;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        this.logger.error(
            `HTTP Status: ${status} Error: ${message} Path: ${request.url}`,
            exception instanceof Error ? exception.stack : ''
        );

        response.status(status).json({
            statusCode: status,
            message: message,
            data: null
        });
    }
}