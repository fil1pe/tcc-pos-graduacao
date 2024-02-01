import { User } from 'src/users/user.entity'

export class CreateEstablishmentDto {
  cnpj: string

  name: string

  address: string

  city: number

  admins?: Pick<User, 'cpf'>[]
}
