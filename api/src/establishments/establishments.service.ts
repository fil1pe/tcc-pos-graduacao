import { Injectable } from '@nestjs/common'
import { CreateEstablishmentDto } from './dto/create-establishment.dto'
import { UpdateEstablishmentDto } from './dto/update-establishment.dto'
import { Establishment } from './entities/establishment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) {}

  // Cadastra estabelecimento:
  async create(createEstablishmentDto: CreateEstablishmentDto) {
    // Verifica duplicidade de CNPJ:
    if (
      await this.establishmentsRepository.findOneBy({
        cnpj: createEstablishmentDto.cnpj,
      })
    )
      throw new Error('O CNPJ já está cadastrado')

    return this.establishmentsRepository.save(createEstablishmentDto)
  }

  // Busca estabelecimento por CNPJ:
  findOne(cnpj: string) {
    return this.establishmentsRepository.findOneByOrFail({ cnpj })
  }

  // Altera dados de estabelecimento:
  async update(cnpj: string, updateEstablishmentDto: UpdateEstablishmentDto) {
    delete updateEstablishmentDto.cnpj // impede troca de CNPJ

    const result = await this.establishmentsRepository.update(
      { cnpj },
      updateEstablishmentDto,
    )

    if (!result.affected)
      throw new Error('Não foi possível atualizar os dados do estabelecimento')

    updateEstablishmentDto.cnpj = cnpj
    return updateEstablishmentDto
  }

  // Remove estabelecimento por CNPJ:
  async remove(cnpj: string) {
    const result = await this.establishmentsRepository.delete({ cnpj })
    if (!result.affected) throw new Error('Estabelecimento não encontrado')
  }
}
