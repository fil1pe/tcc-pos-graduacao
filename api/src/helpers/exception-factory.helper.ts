import { BadRequestException, ValidationError } from '@nestjs/common'

export function exceptionFactory(errors: ValidationError[]) {
  return new BadRequestException({
    statusCode: 400,
    message: 'Corrija os erros e tente novamente',
    errors: errors.reduce((obj, { property, constraints }) => {
      const constraint = Object.keys(constraints)[0]
      let message = constraints[constraint]

      if (constraint === 'isEmail') message = 'E-mail inválido'

      return {
        ...obj,
        [property]: message,
      }
    }, {}),
  })
}
