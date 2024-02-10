import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint()
export class IsPrice implements ValidatorConstraintInterface {
  validate(value: number) {
    try {
      return !!String(value).match(/^\d{1,8}(\.\d\d?)?$/)
    } catch {
      return false
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Preço inválido'
  }
}
