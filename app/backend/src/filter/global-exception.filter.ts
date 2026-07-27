import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { SentryExceptionCaptured, captureException } from "@sentry/nestjs";
import { Request, Response } from "express";
import { BackendLogger } from "../library/logger/BackendLogger";

@Catch()
export class GlobalExceptionFilter<
    T extends Error | HttpException,
> implements ExceptionFilter {
    private readonly logger = new BackendLogger(this.constructor.name);

    @SentryExceptionCaptured()
    catch(exception: T, argumentsHost: ArgumentsHost) {
        const httpArgumentsHost = argumentsHost.switchToHttp();
        const request = httpArgumentsHost.getRequest<Request>();
        const response = httpArgumentsHost.getResponse<Response>();

        if (!(exception instanceof HttpException)) {
            // 意図しない例外は@SentryExceptionCapturedでSentryにキャプチャされるので素直にレスポンスを送信する。
            this.logger.error(exception.message, exception);

            const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

            return response.status(statusCode).json({
                statusCode,
                message: "サーバエラーが発生しました。",
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }

        const statusCode = exception.getStatus();
        if (statusCode < 500) {
            return this.sendErrorResponseFromHttpException(response, exception);
        }

        captureException(exception);

        this.logger.error(exception.message, {
            status: statusCode,
            stack: exception.stack,
        });

        return this.sendErrorResponseFromHttpException(response, exception);
    }

    /**
     * HttpExceptionの中身をレスポンスとして送信します。
     */
    private sendErrorResponseFromHttpException(
        response: Response,
        httpException: HttpException,
    ) {
        return response
            .status(httpException.getStatus())
            .json(httpException.getResponse());
    }
}
