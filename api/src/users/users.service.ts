import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'
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

  // Busca usuário por CPF:
  async findOne(cpf: string) {
    const userData = await this.usersRepository.findOneByOrFail({ cpf })
    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  // Busca usuário por e-mail e senha:
  async findOneByEmailAndPassword(email: string, password: string) {
    const userData = await this.usersRepository.findOneByOrFail({
      email,
    })

    // Verifica se a senha coincide com o retorno:
    if (!(await bcrypt.compare(password, userData.password)))
      throw new Error('A senha informada não coincide')

    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  // Altera dados de usuário:
  async update(cpf: string, updateUserDto: UpdateUserDto) {
    delete updateUserDto.cpf // impede troca de CPF

    // Encripta senha:
    if (updateUserDto.password)
      updateUserDto.password = await encrypt(updateUserDto.password)

    const result = await this.usersRepository.update({ cpf }, updateUserDto)

    if (!result.affected)
      throw new Error('Não foi possível atualizar seus dados')

    updateUserDto.cpf = cpf
    delete updateUserDto.password
    return updateUserDto
  }

  // Remove usuário por CPF:
  async remove(cpf: string) {
    const result = await this.usersRepository.delete({ cpf })
    if (!result.affected) throw new Error('Usuário não encontrado')
  }
}
