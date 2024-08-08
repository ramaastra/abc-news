import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        error: exception.getResponse(),
      });
    } else {
      response.status(500).json({
        error: `Internal server error: ${exception.message}`,
      });
    }
  }
}
