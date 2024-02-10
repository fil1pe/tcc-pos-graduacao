import { encrypt } from 'src/helpers/encrypt.helper'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsCpf } from 'src/helpers/is-cpf.helper'
import { IsDate } from 'src/helpers/is-date.helper'
import { CityExists } from 'src/cities/city-exists.helper'

export class CreateUserDto {
  @ApiProperty()
  @Validate(IsCpf)
  @IsNotEmpty({ message: 'Digite seu CPF' })
  cpf: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Digite seu nome' })
  name: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Digite seu e-mail' })
  email: string

  @ApiProperty()
  @MinLength(8, { message: 'A senha precisa ter 8 caracteres' })
  @IsNotEmpty({ message: 'Digite uma senha' })
  password: string

  @ApiProperty()
  @Validate(IsDate)
  @IsNotEmpty({ message: 'Digite sua data de nascimento' })
  birthDate: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Digite seu endereço' })
  address: string

  @ApiProperty()
  @Validate(CityExists)
  @IsNotEmpty({ message: 'Escolha sua cidade/estado' })
  city: number

  // Encripta senha:
  async encryptPassword() {
    this.password = await encrypt(this.password)
  }
}
