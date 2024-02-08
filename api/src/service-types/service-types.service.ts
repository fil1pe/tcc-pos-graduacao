import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceType } from './service-type.entity'

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceType)
    private serviceTypesRepository: Repository<ServiceType>,
  ) {}

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
