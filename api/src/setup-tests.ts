import 'tsconfig-paths/register'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { config } from 'src/ormconfig'
import { User } from 'src/users/user.entity'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { fake as fakeCpf } from 'validation-br/dist/cpf'
import { Establishment } from 'src/establishments/establishment.entity'
import { EstablishmentsService } from 'src/establishments/establishments.service'
import { CreateEstablishmentDto } from './establishments/dto/create-establishment.dto'
import { fake as fakeCnpj } from 'validation-br/dist/cnpj'
import { Service } from 'src/services/service.entity'
import { ServicesService } from 'src/services/services.service'
import { CreateServiceDto } from 'src/services/create-service.dto'

export default async () => {
  const userModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(config),
      TypeOrmModule.forFeature([User, Establishment, Service]),
    ],
    providers: [UsersService, EstablishmentsService, ServicesService],
  }).compile()
  global.usersModule = userModule

  const usersService = userModule.get<UsersService>(UsersService)
  global.usersService = usersService
  const establishmentsService = userModule.get<EstablishmentsService>(
    EstablishmentsService,
  )
  global.establishmentsService = establishmentsService
  const servicesService = userModule.get<ServicesService>(ServicesService)
  global.servicesService = servicesService

  // Cadastra usuário de teste:
  const user = new CreateUserDto()
  user.cpf = fakeCpf()
  user.name = 'João da Silva'
  user.email = 'joao@mail.com'
  process.env.jestUserPassword = '12345678'
  user.password = process.env.jestUserPassword
  user.birthDate = '10/01/1992'
  user.address = 'Rua X, 100'
  user.city = 1
  global.user = await usersService.create(user)
  process.env.jestUser = JSON.stringify(global.user)

  // Cadastra estabelecimento de teste:
  const establishment = new CreateEstablishmentDto()
  establishment.cnpj = fakeCnpj()
  establishment.name = 'Restaurante'
  establishment.address = 'Rua X, 101'
  establishment.city = 1
  global.establishment = await establishmentsService.create(
    user.cpf,
    establishment,
  )
  process.env.jestEstablishment = JSON.stringify(global.establishment)

  // Cadastra serviço de teste:
  const service = new CreateServiceDto()
  service.price = 100
  service.type = 1
  process.env.jestService = JSON.stringify(
    await servicesService.create(user.cpf, establishment.cnpj, service),
  )
}
