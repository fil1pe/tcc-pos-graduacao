import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { encrypt } from 'src/helpers/encrypt.helper'

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

  find() {
    return 'This action returns the user'
  }

  // Busca usuário por e-mail e senha:
  async findByEmailAndPassword(email: string, password: string) {
    password = await encrypt(password) // encripta senha
    const userData = await this.usersRepository.findOneByOrFail({
      email,
      password,
    })
    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  update(updateUserDto: UpdateUserDto) {
    return 'This action updates the user'
  }

  remove() {
    return 'This action removes the user'
  }
}
