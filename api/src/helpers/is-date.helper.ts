import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import * as validateDate from 'validate-date'

@ValidatorConstraint()
export class IsDate implements ValidatorConstraintInterface {
  validate(value: string) {
    try {
      return validateDate(value, 'boolean', 'dd/mm/yyyy')
    } catch {
      return false
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Data inválida'
  }
}
