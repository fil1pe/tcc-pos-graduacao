import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { City } from './city.entity'
import { Repository } from 'typeorm'

@ValidatorConstraint({ async: true })
@Injectable()
export class CityExists implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  // Verifica se a cidade informada existe:
  async validate(value: number) {
    try {
      await this.citiesRepository.findOneOrFail({ where: { id: value } })
    } catch {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    return 'Cidade/estado inválido'
  }
}
