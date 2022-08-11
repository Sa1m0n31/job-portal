import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class WrongExtensionException implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        console.log(request);
        console.log(request.body);
        console.log('-----');
        console.log(response);
        console.log(status);

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}
