import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { fake } from 'validation-br/dist/cpf'
import { CreateUserDto } from './dto/create-user.dto'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { config } from 'src/ormconfig'

describe('UsersService', () => {
  let module: TestingModule
  let service: UsersService
  const password = '12345678'
  let user: CreateUserDto

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)

    user = new CreateUserDto()
    user.cpf = fake()
    user.name = 'João da Silva'
    user.email = 'joao@mail.com'
    user.password = password
    user.birthDate = '10/01/1992'
    user.address = 'Rua X, 100'
    user.city = 1
    await service.create(user)
  })

  afterAll(async () => {
    await service.remove(user.cpf)
    await module.close()
  })

  // Testa login:
  it('successful login', async () => {
    const userFromLogin = await service.findOneByEmailAndPassword(
      user.email,
      password,
    )
    expect(userFromLogin.cpf).toBe(user.cpf)
  })

  // Testa cadastro com CPF duplicado:
  it('duplicated CPF on register', () => {
    const user2 = new CreateUserDto()
    user2.cpf = user.cpf
    user2.name = 'Maria de Oliveira'
    user2.email = 'maria@mail.com'
    user2.password = password
    user2.birthDate = '23/11/1988'
    user2.address = 'Rua X, 200'
    user2.city = 1
    expect(() => service.create(user2)).rejects.toThrow(
      'O CPF já está cadastrado',
    )
  })
})
