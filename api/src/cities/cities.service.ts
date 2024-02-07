import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { City } from './city.entity'

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  // Busca todas as cidades:
  findAll() {
    return this.citiesRepository.find()
  }

  // Busca cidade específica:
  async findOne(id: number) {
    try {
      return await this.citiesRepository.findOneOrFail({ where: { id } })
    } catch {
      throw new NotFoundException()
    }
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Cidade não encontrada', 404)
  }
}
