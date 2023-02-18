import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let statusCode = response.statusCode;
    let message = exception.message;
    console.log(exception);
    // TODO: Handle Error Response here
    switch (exception.code) {
      case 11000: {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      }
      default: {
        message = 'Unknown Error';
        break;
      }
    }
    response.status(statusCode).json({
      statusCode,
      path: request.url,
      message,
    });
  }
}
