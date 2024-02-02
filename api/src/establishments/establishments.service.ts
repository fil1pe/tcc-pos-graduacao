import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateEstablishmentDto } from './dto/create-establishment.dto'
import { UpdateEstablishmentDto } from './dto/update-establishment.dto'
import { Establishment } from './entities/establishment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) {}

  // Cadastra estabelecimento:
  async create(cpf: string, createEstablishmentDto: CreateEstablishmentDto) {
    // Verifica duplicidade de CNPJ:
    if (
      await this.establishmentsRepository.findOneBy({
        cnpj: createEstablishmentDto.cnpj,
      })
    )
      throw new Error('O CNPJ já está cadastrado')

    createEstablishmentDto.admins = [{ cpf }]

    return this.establishmentsRepository.save(createEstablishmentDto)
  }

  // Busca estabelecimentos por admin:
  findAllByAdmin(cpf: string) {
    return this.establishmentsRepository.find({
      where: {
        admins: {
          cpf,
        },
      },
    })
  }

  findOneByAdminAndCnpj(cpf: string, cnpj: string) {
    return this.establishmentsRepository.findOneOrFail({
      where: {
        cnpj,
        admins: {
          cpf,
        },
      },
    })
  }

  async checkAdmin(cpf: string, cnpj: string) {
    try {
      await this.findOneByAdminAndCnpj(cpf, cnpj)
    } catch {
      throw new UnauthorizedException()
    }
  }

  // Busca estabelecimento por CNPJ:
  findOne(cnpj: string) {
    return this.establishmentsRepository.findOneByOrFail({ cnpj })
  }

  // Altera dados de estabelecimento:
  async update(
    cpf: string,
    cnpj: string,
    updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    let result: UpdateResult
    try {
      await this.findOneByAdminAndCnpj(cpf, cnpj) // verifica se CPF é admin

      delete updateEstablishmentDto.cnpj // impede troca de CNPJ

      result = await this.establishmentsRepository.update(
        { cnpj },
        updateEstablishmentDto,
      )
    } catch {
      throw new UnauthorizedException()
    }

    if (!result.affected)
      throw new Error('Não foi possível atualizar os dados do estabelecimento')

    updateEstablishmentDto.cnpj = cnpj
    return updateEstablishmentDto
  }

  // Remove estabelecimento por CNPJ:
  async remove(cpf: string, cnpj: string) {
    let result: DeleteResult
    try {
      await this.findOneByAdminAndCnpj(cpf, cnpj) // verifica se CPF é admin
      result = await this.establishmentsRepository.delete({ cnpj })
    } catch {
      throw new UnauthorizedException()
    }
    if (!result.affected) throw new Error('Estabelecimento não encontrado')
  }
}
