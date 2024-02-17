import { HttpException, Injectable } from '@nestjs/common'
import { CreateInterestDto } from './create-interest.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Interest } from './interest.entity'
import { Repository } from 'typeorm'
import { Match } from 'src/matches/match.entity'
import { ValidationException } from 'src/helpers/validation-exception.helper'

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  // Cadastra interesse:
  async create(
    cpf: string,
    {
      serviceType,
      minPrice,
      maxPrice,
      minDate,
      maxDate,
      people,
    }: CreateInterestDto,
  ) {
    if (minPrice > maxPrice)
      throw new ValidationException(
        'maxPrice',
        'O valor máximo é menor que o valor mínimo',
      )

    const minDateSeconds = Date.parse(minDate)

    if (minDateSeconds < Date.now())
      throw new ValidationException('minDate', 'Data inválida')

    if (minDateSeconds > Date.parse(maxDate))
      throw new ValidationException(
        'maxDate',
        'A última data vem antes da primeira data',
      )

    return this.interestsRepository.save({
      serviceType: {
        id: serviceType,
      },
      minPrice,
      maxPrice,
      minDate,
      maxDate,
      people,
      user: {
        cpf,
      },
    })
  }

  // Query de busca dos interesses do usuário:
  find(cpf: string) {
    return this.interestsRepository
      .createQueryBuilder('interests')
      .leftJoinAndMapOne(
        'interests.match',
        Match,
        'matches',
        'matches.interest = interests.id',
      )
      .where('interests.user = :cpf', { cpf })
  }

  // Busca todos os interesses do usuário:
  findAll(cpf: string) {
    return this.find(cpf).getMany()
  }

  // Busca interesse específico do usuário:
  async findOne(cpf: string, id: number) {
    try {
      return await this.find(cpf)
        .andWhere('interests.id = :id', { id })
        .getOneOrFail()
    } catch {
      throw new NotFoundException()
    }
  }

  // Remove interesse do usuário:
  async remove(cpf: string, id: number) {
    const { affected } = await this.interestsRepository.delete({
      id,
      user: {
        cpf,
      },
    })
    if (!affected) throw new NotFoundException()
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Interesse não encontrado', 404)
  }
}
