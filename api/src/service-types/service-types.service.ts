import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceType } from './service-type.entity'
import { CreateServiceTypeDto } from './create-service-type.dto'

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypesRepository: Repository<ServiceType>,
  ) {}

  // Cadastra tipos de serviço:
  create(types: CreateServiceTypeDto[]) {
    return this.serviceTypesRepository
      .createQueryBuilder()
      .insert()
      .values(types.map(({ name }) => ({ name })))
      .orIgnore()
      .execute()
  }

  // Busca todos os tipos de serviço:
  findAll() {
    return this.serviceTypesRepository.find()
  }

  // Busca tipo específico de serviço:
  async findOne(id: number) {
    try {
      return await this.serviceTypesRepository.findOneOrFail({ where: { id } })
    } catch {
      throw new NotFoundException()
    }
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Tipo de serviço não encontrado', 404)
  }
}
