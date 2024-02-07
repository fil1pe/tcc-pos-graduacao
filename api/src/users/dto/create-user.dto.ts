import { Transform } from 'class-transformer'
import { transformDate } from 'src/helpers/date-transform.helper'
import { encrypt } from 'src/helpers/encrypt.helper'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  cpf: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  @Transform(transformDate)
  birthDate: Date

  @ApiProperty()
  address: string

  @ApiProperty()
  city: number

  // Encripta senha:
  async encryptPassword() {
    this.password = await encrypt(this.password)
  }
}
