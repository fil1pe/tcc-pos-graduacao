import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { IsPrice } from 'src/helpers/is-price.helper'
import { ServiceTypeExists } from 'src/service-types/service-type-exists.helper'

export class CreateServiceDto {
  @ApiProperty()
  @Validate(ServiceTypeExists)
  @IsNotEmpty({ message: 'Escolha o tipo de serviço' })
  type: number

  @ApiProperty()
  @Validate(IsPrice)
  @IsNotEmpty({ message: 'Digite o preço' })
  price: number
}
