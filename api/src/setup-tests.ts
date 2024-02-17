import 'tsconfig-paths/register'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from 'src/users/users.service'
import { config } from 'src/ormconfig'
import { User } from 'src/users/user.entity'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { fake as fakeCpf } from 'validation-br/dist/cpf'

export default async () => {
  const userModule = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(config), TypeOrmModule.forFeature([User])],
    providers: [UsersService],
  }).compile()
  global.usersModule = userModule

  const usersService = userModule.get<UsersService>(UsersService)
  global.usersService = usersService

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
}
