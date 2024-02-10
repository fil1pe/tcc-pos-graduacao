import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateEstablishmentDto } from './dto/create-establishment.dto'
import { UpdateEstablishmentDto } from './dto/update-establishment.dto'
import { Establishment } from './establishment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiTags } from '@nestjs/swagger'
import { ValidationException } from 'src/helpers/validation-exception.helper'

@ApiTags('establishments')
@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) {}

  // Cadastra estabelecimento:
  async create(
    cpf: string,
    { cnpj, name, address, city }: CreateEstablishmentDto,
  ) {
    // Verifica duplicidade de CNPJ:
    if (
      await this.establishmentsRepository.findOneBy({
        cnpj,
      })
    )
      throw new ValidationException('cnpj', 'O CNPJ já está cadastrado')

    return this.establishmentsRepository.save({
      cnpj,
      name,
      address,
      city: {
        id: city,
      },
      admins: [{ cpf }],
    })
  }

  // Busca estabelecimentos por admin:
  findAll(cpf: string) {
    return this.establishmentsRepository.find({
      where: {
        admins: {
          cpf,
        },
      },
      relations: {
        city: true as never,
      },
    })
  }

  // Busca estabelecimento específico:
  findOne(cnpj: string) {
    try {
      return this.establishmentsRepository.findOneOrFail({
        where: {
          cnpj,
        },
        relations: {
          city: true as never,
        },
      })
    } catch {
      throw new NotFoundException()
    }
  }

  // Verifica autoridade:
  async checkAdmin(cpf: string, cnpj: string) {
    if (!cpf || !cnpj) throw new UnauthorizedException()
    try {
      await this.establishmentsRepository.findOneOrFail({
        where: {
          cnpj,
          admins: {
            cpf,
          },
        },
      })
    } catch {
      throw new UnauthorizedException()
    }
  }

  // Altera dados de estabelecimento:
  async update(
    cpf: string,
    cnpj: string,
    { name, address, city, admins }: UpdateEstablishmentDto,
  ) {
    await this.checkAdmin(cpf, cnpj) // verifica autoridade

    const { affected } = await this.establishmentsRepository.update(
      { cnpj },
      {
        name,
        address,
        city: city || city === 0 ? { id: city } : undefined,
        admins,
      },
    )

    if (!affected)
      throw new HttpException(
        'Não foi possível atualizar os dados do estabelecimento',
        500,
      )
  }

  // Remove estabelecimento:
  async remove(cpf: string, cnpj: string) {
    await this.checkAdmin(cpf, cnpj)
    const { affected } = await this.establishmentsRepository.delete({ cnpj })
    if (!affected) throw new NotFoundException()
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Estabelecimento não encontrado', 404)
  }
}
