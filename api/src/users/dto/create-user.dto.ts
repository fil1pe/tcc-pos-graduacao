import { Transform } from 'class-transformer'
import { transformDate } from 'src/helpers/date-transform.helper'
import { encrypt } from 'src/helpers/encrypt.helper'

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
    this.password = await encrypt(this.password)
  }
}
