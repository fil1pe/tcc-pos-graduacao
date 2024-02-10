import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsCnpj } from 'src/helpers/is-cnpj.helper'
import { CityExists } from 'src/cities/city-exists.helper'

export class CreateEstablishmentDto {
  @ApiProperty()
  @Validate(IsCnpj)
  @IsNotEmpty({ message: 'Digite o CNPJ' })
  cnpj: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Digite o nome' })
  name: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Digite o endereço' })
  address: string

  @ApiProperty()
  @Validate(CityExists)
  @IsNotEmpty({ message: 'Escolha a cidade/estado' })
  city: number

  @ApiProperty()
  admins?: Pick<User, 'cpf'>[]
}
