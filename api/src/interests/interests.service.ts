import { HttpException, Injectable } from '@nestjs/common'
import { CreateInterestDto } from './create-interest.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Interest } from './interest.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  // Cadastra interesse:
  create(
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
    return this.interestsRepository.save({
      serviceType,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 99999999.99,
      minDate,
      maxDate,
      people,
      user: {
        cpf,
      },
    })
  }

  // Busca todos os interesses do usuário:
  findAll(cpf: string) {
    return this.interestsRepository.find({
      where: {
        user: {
          cpf,
        },
      },
    })
  }

  // Busca interesse específico do usuário:
  async findOne(cpf: string, id: number) {
    try {
      return await this.interestsRepository.findOneOrFail({
        where: {
          id,
          user: {
            cpf,
          },
        },
      })
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
