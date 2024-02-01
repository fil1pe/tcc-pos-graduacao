import { Transform } from 'class-transformer'
import { transformDate } from 'src/helpers/date-transform.helper'
import * as bcrypt from 'bcrypt'

export class CreateUserDto {
  cpf: string

  name: string

  email: string

  password: string

  @Transform(transformDate)
  birthDate: Date

  address: string

  city: number

  // Encripta senha:
  async encryptPassword() {
    const SALT_ROUNDS = 10
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
  }
}
