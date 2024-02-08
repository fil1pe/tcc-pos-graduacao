import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
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
    await this.establishmentsService.checkAdmin(cpf, cnpj) // verifica autoridade p/ estabelecimento
    return this.servicesRepository.save({
      type: {
        id: type,
      },
      price,
      establishment: { cnpj },
    })
  }

  // Busca todos os serviços de um estabelecimento:
  findAll(cnpj: string) {
    return this.servicesRepository.find({
      where: {
        establishment: { cnpj },
      },
    })
  }

  // Busca serviço específico:
  async findOne(id: number) {
    try {
      return await this.servicesRepository.findOneOrFail({
        where: {
          id,
        },
        relations: {
          establishment: {
            city: true as never,
          },
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }

  // Remove serviço:
  async remove(cpf: string, id: number) {
    await this.checkAdmin(cpf, id) // verifica autoridade
    const { affected } = await this.servicesRepository.delete({ id })
    if (!affected) throw new NotFoundException()
  }

  // Verifica autoridade:
  async checkAdmin(cpf: string, id: number) {
    try {
      await this.servicesRepository.findOneOrFail({
        where: {
          id,
          establishment: {
            admins: {
              cpf,
            },
          },
        },
      })
    } catch {
      throw new UnauthorizedException()
    }
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Serviço não encontrado', 404)
  }
}
