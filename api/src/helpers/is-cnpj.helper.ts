import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isCNPJ } from 'validation-br'

@ValidatorConstraint()
export class IsCnpj implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false
    if (value.length !== 14) return false
    return isCNPJ(value)
  }

  defaultMessage(args: ValidationArguments) {
    return 'CNPJ inválido'
  }
}
