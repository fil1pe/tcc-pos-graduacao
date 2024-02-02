import { HttpException, Injectable } from '@nestjs/common'
import { CreateServiceDto } from './create-service.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Service } from './service.entity'
import { Repository } from 'typeorm'
import { EstablishmentsService } from '../establishments/establishments.service'

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private establishmentsService: EstablishmentsService,
  ) {}

  // Cadastra serviço:
  async create(cpf: string, cnpj: string, { type, price }: CreateServiceDto) {
    await this.establishmentsService.isAdmin(cpf, cnpj) // verifica autoridade
    return this.servicesRepository.save({
      type,
      price,
      establishment: { cnpj },
    })
  }

  // Busca todos os serviços de um estabelecimento:
  findAll(cnpj: string) {
    return this.servicesRepository.findBy({
      establishment: { cnpj },
    })
  }

  // Busca serviço específico de um estabelecimento:
  async findOne(cnpj: string, id: number) {
    try {
      return await this.servicesRepository.findOneByOrFail({
        establishment: { cnpj },
        id,
      })
    } catch {
      throw new NotFoundException()
    }
  }

  // Remove serviço:
  async remove(cpf: string, cnpj: string, id: number) {
    await this.establishmentsService.isAdmin(cpf, cnpj) // verifica autoridade
    const { affected } = await this.servicesRepository.delete({ id })
    if (!affected) throw new NotFoundException()
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Serviço não encontrado', 404)
  }
}
