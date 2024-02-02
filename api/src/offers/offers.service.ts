import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateOfferDto } from './create-offer.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Offer } from './offer.entity'
import { Repository } from 'typeorm'
import { ServicesService } from '../services/services.service'

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private servicesService: ServicesService,
  ) {}

  // Cadastra oferta:
  async create(
    cpf: string,
    id: number,
    { minPeople, maxPeople }: CreateOfferDto,
  ) {
    await this.servicesService.isAdmin(cpf, id) // verifica autoridade p/ serviço
    return this.offersRepository.save({
      minPeople,
      maxPeople,
      service: {
        id,
      },
    })
  }

  // Busca todas as ofertas de um serviço:
  findAll(id: number) {
    return this.offersRepository.find({
      where: {
        service: {
          id,
        },
      },
      relations: {
        service: true,
      },
    })
  }

  // Busca oferta específica:
  async findOne(oid: number) {
    try {
      return await this.offersRepository.findOneOrFail({
        where: {
          id: oid,
        },
        relations: {
          service: true,
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }

  // Remove oferta:
  async remove(cpf: string, oid: number) {
    await this.isAdmin(cpf, oid) // verifica autoridade
    const { affected } = await this.offersRepository.delete({ id: oid })
    if (!affected) throw new NotFoundException()
  }

  // Verifica autoridade:
  async isAdmin(cpf: string, oid: number) {
    try {
      await this.offersRepository.findOneOrFail({
        where: {
          id: oid,
          service: {
            establishment: {
              admins: {
                cpf,
              },
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
    super('Oferta não encontrada', 404)
  }
}
