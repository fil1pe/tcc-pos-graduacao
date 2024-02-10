import { HttpException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcryptjs'
import { parseDate } from 'src/helpers/parse-date.helper'
import { ValidationException } from 'src/helpers/validation-exception.helper'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Cadastra usuário:
  async create(createUserDto: CreateUserDto) {
    // Verifica duplicidade de CPF:
    if (await this.usersRepository.findOneBy({ cpf: createUserDto.cpf }))
      throw new ValidationException('cpf', 'O CPF já está cadastrado')

    // Verifica duplicidade de e-mail:
    if (await this.usersRepository.findOneBy({ email: createUserDto.email }))
      throw new ValidationException('email', 'O e-mail já está cadastrado')

    await createUserDto.encryptPassword() // encripta senha
    const { cpf, name, email, birthDate, password, address, city } =
      createUserDto

    const userData = await this.usersRepository.save({
      cpf,
      name,
      email,
      birthDate: parseDate(birthDate),
      password,
      address,
      city: {
        id: city,
      },
    })
    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  // Busca dados do usuário:
  async findOne(cpf: string) {
    try {
      const userData = await this.usersRepository.findOneOrFail({
        where: {
          cpf,
        },
        relations: {
          city: true,
        },
      })
      delete userData.password // remove a senha do retorno por segurança
      return userData
    } catch {
      throw new NotFoundException()
    }
  }

  // Busca usuário por e-mail e senha:
  async findOneByEmailAndPassword(email: string, password: string) {
    const userData = await this.usersRepository.findOneOrFail({
      where: {
        email,
      },
    })

    // Verifica se a senha coincide com o retorno:
    if (!(await bcrypt.compare(password, userData.password)))
      throw new HttpException('A senha informada não coincide', 400)

    delete userData.password // remove a senha do retorno por segurança
    return userData
  }

  // Altera dados do usuário:
  async update(cpf: string, updateUserDto: UpdateUserDto) {
    await updateUserDto.encryptPassword() // encripta senha
    const { name, password, email, birthDate, address, city } = updateUserDto

    // Verifica duplicidade de e-mail:
    if (
      await this.usersRepository.findOne({
        where: { email: updateUserDto.email, cpf: Not(cpf) },
      })
    )
      throw new ValidationException('email', 'O e-mail já está cadastrado')

    const { affected } = await this.usersRepository.update(
      { cpf },
      {
        name,
        password,
        email,
        birthDate: birthDate && parseDate(birthDate),
        address,
        city: city || city === 0 ? { id: city } : undefined,
      },
    )

    if (!affected)
      throw new HttpException('Não foi possível atualizar seus dados', 500)
  }

  // Remove o usuário:
  async remove(cpf: string) {
    const { affected } = await this.usersRepository.delete({ cpf })
    if (!affected) throw new NotFoundException()
  }
}

class NotFoundException extends HttpException {
  constructor() {
    super('Usuário não encontrado', 404)
  }
}
