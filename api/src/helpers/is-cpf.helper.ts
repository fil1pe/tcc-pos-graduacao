import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { isCPF } from 'validation-br'

@ValidatorConstraint()
export class IsCpf implements ValidatorConstraintInterface {
  validate(value: string) {
    if (value.length !== 11) return false
    return isCPF(value)
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido'
  }
}
