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
import { Match } from 'src/matches/match.entity'
import { Service } from 'src/services/service.entity'

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
    await this.servicesService.checkAdmin(cpf, id) // verifica autoridade p/ serviço
    return this.offersRepository.save({
      minPeople,
      maxPeople,
      service: {
        id,
      },
    })
  }

  // Query de busca das ofertas:
  find() {
    return this.offersRepository
      .createQueryBuilder('offers')
      .leftJoinAndMapOne(
        'offers.match',
        Match,
        'matches',
        'matches.offer = offers.id',
      )
  }

  // Busca todas as ofertas de um serviço:
  findAll(id: number) {
    return this.find().where('offers.service = :id', { id }).getMany()
  }

  // Busca oferta específica:
  async findOne(oid: number) {
    try {
      return await this.find()
        .leftJoinAndMapOne(
          'offers.service',
          Service,
          'services',
          'services.id = offers.service',
        )
        .where('offers.id = :oid', { oid })
        .getOneOrFail()
    } catch {
      throw new NotFoundException()
    }
  }

  // Remove oferta:
  async remove(cpf: string, oid: number) {
    await this.checkAdmin(cpf, oid) // verifica autoridade
    const { affected } = await this.offersRepository.delete({ id: oid })
    if (!affected) throw new NotFoundException()
  }

  // Verifica autoridade:
  async checkAdmin(cpf: string, oid: number) {
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
