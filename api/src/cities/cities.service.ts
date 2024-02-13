import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { City } from './city.entity'
import { CreateCityDto } from './create-city.dto'

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  // Cadastra cidades:
  create(cities: CreateCityDto[]) {
    return this.citiesRepository
      .createQueryBuilder()
      .insert()
      .values(cities.map(({ name, uf }) => ({ name, uf })))
      .orIgnore()
      .execute()
  }

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
