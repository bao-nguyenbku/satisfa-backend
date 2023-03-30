import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ValidationError,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
        : undefined;
    /**
     * @description Exception json response
     * @param message
     */
    const responseMessage = (type: string, message: string) => {
      response.status(status).json({
        statusCode: status,
        path: request.url,
        type,
        message,
      });
    };

    // Throw an exceptions for either
    // MongoError, ValidationError, TypeError, CastError and Error
    if (message) {
      responseMessage(exception.name, message);
    } else if (exception.message) {
      responseMessage('Error', exception.message);
    } else {
      responseMessage(exception.name, exception.message);
    }
  }
}
