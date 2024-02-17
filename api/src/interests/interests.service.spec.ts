import { Test, TestingModule } from '@nestjs/testing'
import { User } from 'src/users/user.entity'
import { Interest } from './interest.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'
import { InterestsService } from './interests.service'
import { CreateInterestDto } from './create-interest.dto'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

describe('InterestsService', () => {
  let user: User
  let module: TestingModule
  let service: InterestsService

  beforeAll(async () => {
    user = JSON.parse(process.env.jestUser)
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([Interest]),
      ],
      providers: [InterestsService],
    }).compile()
    service = module.get<InterestsService>(InterestsService)
  })

  afterAll(async () => {
    await module.close()
  })

  // Testa interesses inválidos e válido:
  it('interests', async () => {
    const interest = new CreateInterestDto()
    interest.minPrice = 0
    interest.maxPrice = 100
    interest.minDate = new Date(Date.now() + 3600000).toISOString()
    interest.maxDate = new Date(Date.now() + 86400000).toISOString()
    interest.people = 1

    await Promise.all([
      expect(
        validateDto(
          plainToInstance(CreateInterestDto, { interest, people: 0 }),
        ),
      ).rejects.not.toHaveLength(0),
      expect(
        validateDto(
          plainToInstance(CreateInterestDto, { interest, minPrice: -100 }),
        ),
      ).rejects.not.toHaveLength(0),
      expect(
        service.create(user.cpf, {
          ...interest,
          serviceType: 1,
          maxDate: new Date(Date.now() - 86400000).toISOString(),
        }),
      ).rejects.toThrow(),
      expect(
        service.create(user.cpf, {
          ...interest,
          serviceType: 1,
          minPrice: 100,
          maxPrice: 0,
        }),
      ).rejects.toThrow(),
      expect(
        service.create(user.cpf, {
          ...interest,
          serviceType: 1,
        }),
      ).resolves.toBeDefined(),
    ])
  })
})

function validateDto(dto: CreateInterestDto) {
  return new Promise<void>((resolve, reject) => {
    validate(dto, { skipUndefinedProperties: true })
      .then((errors) => {
        if (errors.length) reject(errors)
        else resolve()
      })
      .catch((err) => reject(err))
  })
}
