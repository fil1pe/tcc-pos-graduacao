import { Test, TestingModule } from '@nestjs/testing'
import { User } from 'src/users/user.entity'
import { Establishment } from 'src/establishments/establishment.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'
import { EstablishmentsService } from 'src/establishments/establishments.service'
import { ServicesService } from 'src/services/services.service'
import { Service } from 'src/services/service.entity'
import { Offer } from './offer.entity'
import { OffersService } from './offers.service'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreateOfferDto } from './create-offer.dto'

describe('OffersService', () => {
  let user: User
  let establishment: Establishment
  let service: Service
  let offer: Offer
  let module: TestingModule
  let moduleService: OffersService
  const date = new Date(Date.now() + 3600000).toISOString()

  beforeAll(async () => {
    user = JSON.parse(process.env.jestUser)
    establishment = JSON.parse(process.env.jestEstablishment)
    service = JSON.parse(process.env.jestService)
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Establishment, Service, Offer]),
      ],
      providers: [EstablishmentsService, ServicesService, OffersService],
    }).compile()
    moduleService = module.get<OffersService>(OffersService)
    offer = await moduleService.create(user.cpf, service.id, {
      date,
      minPeople: 1,
      maxPeople: 2,
    })
  })

  afterAll(async () => {
    await module.close()
  })

  // Testa ofertas inválidas:
  it('invalid offers', async () => {
    await Promise.all([
      expect(
        validateDto(
          plainToInstance(CreateOfferDto, {
            date,
            minPeople: 0,
            maxPeople: 1,
          }),
        ),
      ).rejects.not.toHaveLength(0),
      expect(
        validateDto(
          plainToInstance(CreateOfferDto, {
            date,
            minPeople: -1,
            maxPeople: 1,
          }),
        ),
      ).rejects.not.toHaveLength(0),
      expect(
        moduleService.create(user.cpf, service.id, {
          date,
          minPeople: 2,
          maxPeople: 1,
        }),
      ).rejects.toThrow(),
    ])
  })

  // Testa remoção de oferta:
  it('offer removal', async () => {
    await expect(
      moduleService.remove('11122233344', offer.id),
    ).rejects.toThrow()
    await expect(
      moduleService.remove(user.cpf, offer.id),
    ).resolves.not.toThrow()
  })
})

function validateDto(dto: CreateOfferDto) {
  return new Promise<void>((resolve, reject) => {
    validate(dto)
      .then((errors) => {
        if (errors.length) reject(errors)
        else resolve()
      })
      .catch((err) => reject(err))
  })
}
