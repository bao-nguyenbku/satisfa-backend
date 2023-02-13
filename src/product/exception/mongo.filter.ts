import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import MongooseError from 'mongoose/lib/error';
type ResponseErrorType = {
  statusCode: number;
  message: string;
};

@Catch(MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    console.log(
      '🚀 ~ file: mongo.filter.ts:17 ~ MongoExceptionFilter ~ exception',
      exception,
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest()
    let error: ResponseErrorType;
    switch (exception.name) {
      case 'DocumentNotFoundError': {
        error = {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        };
        break;
      }
      // case 'MongooseError': { break; } // general Mongoose error
      // case 'CastError': { break; }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      case 'ValidatorError': {
        error = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Some thing went wrong',
        };
        break;
      }
      // case 'ValidationError': { break; }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Error',
        };
        break;
      }
    }

    response.status(error.statusCode).json(error);
  }
}
