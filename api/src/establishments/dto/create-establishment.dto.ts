import { User } from 'src/users/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEstablishmentDto {
  @ApiProperty()
  cnpj: string

  @ApiProperty()
  name: string

  @ApiProperty()
  address: string

  @ApiProperty()
  city: number

  @ApiProperty()
  admins?: Pick<User, 'cpf'>[]
}
