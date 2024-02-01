import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Cadastra usuário:
  async create(createUserDto: CreateUserDto) {
    await createUserDto.encryptPassword() // encripta senha

    // Verifica duplicidade de CPF:
    if (await this.usersRepository.findOneBy({ cpf: createUserDto.cpf }))
      throw new Error('O CPF já está cadastrado')

    const userData = await this.usersRepository.save(createUserDto)
    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  async findOne(cpf: string) {
    const userData = await this.usersRepository.findOneByOrFail({ cpf })
    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  // Busca usuário por e-mail e senha:
  async findByEmailAndPassword(email: string, password: string) {
    const userData = await this.usersRepository.findOneByOrFail({
      email,
    })

    // Verifica se a senha coincide com o retorno:
    if (!(await bcrypt.compare(password, userData.password)))
      throw new Error('A senha informada não coincide')

    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  update(updateUserDto: UpdateUserDto) {
    return 'This action updates the user'
  }

  async remove(cpf: string) {
    const result = await this.usersRepository.delete({ cpf })
    if (!result.affected) throw new Error('Usuário não encontrado')
  }
}
