import { HttpException } from '@nestjs/common'

export class ValidationException extends HttpException {
  constructor(property: string, message: string) {
    super(
      {
        statusCode: 400,
        message,
        errors: {
          [property]: message,
        },
      },
      400,
    )
  }
}
