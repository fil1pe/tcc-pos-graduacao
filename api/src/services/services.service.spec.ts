import { Test, TestingModule } from '@nestjs/testing'
import { User } from 'src/users/user.entity'
import { Establishment } from 'src/establishments/establishment.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'
import { EstablishmentsService } from 'src/establishments/establishments.service'
import { ServicesService } from './services.service'
import { Service } from './service.entity'

describe('ServicesService', () => {
  let user: User
  let establishment: Establishment
  let service: Service
  let module: TestingModule
  let moduleService: ServicesService

  beforeAll(async () => {
    user = JSON.parse(process.env.jestUser)
    establishment = JSON.parse(process.env.jestEstablishment)
    service = JSON.parse(process.env.jestService)
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Establishment, Service]),
      ],
      providers: [EstablishmentsService, ServicesService],
    }).compile()
    moduleService = module.get<ServicesService>(ServicesService)
  })

  afterAll(async () => {
    await module.close()
  })

  // Testa se serviço é listado:
  it('service is listed', async () => {
    const services = await moduleService.findAll(establishment.cnpj)
    expect(services.find(({ id }) => id === service.id)).toBeDefined()
  })

  // Testa autoridade sobre o serviço:
  it('service admin', async () => {
    await Promise.all([
      expect(
        moduleService.checkAdmin(user.cpf, service.id),
      ).resolves.not.toThrow(),
      expect(
        moduleService.checkAdmin('11122233344', service.id),
      ).rejects.toThrow(),
    ])
  })
})
