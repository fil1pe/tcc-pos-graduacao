import { Test, TestingModule } from '@nestjs/testing'
import { User } from 'src/users/user.entity'
import { Establishment } from './establishment.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'
import { EstablishmentsService } from './establishments.service'

describe('EstablishmentsService', () => {
  let user: User
  let establishment: Establishment
  let module: TestingModule
  let service: EstablishmentsService

  beforeAll(async () => {
    user = JSON.parse(process.env.jestUser)
    establishment = JSON.parse(process.env.jestEstablishment)
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Establishment]),
      ],
      providers: [EstablishmentsService],
    }).compile()
    service = module.get<EstablishmentsService>(EstablishmentsService)
  })

  afterAll(async () => {
    await module.close()
  })

  // Testa alteração de dados do estabelecimento:
  it('establishment update', async () => {
    await service.update(user.cpf, establishment.cnpj, {
      address: establishment.address + '0',
    })
    const establishmentUpdated = await service.findOne(establishment.cnpj)
    expect(establishmentUpdated.address).toBe(establishment.address + '0')
  })

  // Testa autoridade sobre o estabelecimento:
  it('establishment admin', async () => {
    await Promise.all([
      expect(
        service.checkAdmin(user.cpf, establishment.cnpj),
      ).resolves.not.toThrow(),
      expect(
        service.checkAdmin('11122233344', establishment.cnpj),
      ).rejects.toThrow(),
    ])
  })
})
