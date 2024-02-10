import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { ServiceType } from './service-type.entity'
import { Repository } from 'typeorm'

@ValidatorConstraint({ async: true })
@Injectable()
export class ServiceTypeExists implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypesRepository: Repository<ServiceType>,
  ) {}

  // Verifica se o tipo de serviço informado existe:
  async validate(value: number) {
    try {
      await this.serviceTypesRepository.findOneOrFail({ where: { id: value } })
    } catch {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    return 'Tipo de serviço inválido'
  }
}
