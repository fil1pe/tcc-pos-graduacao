import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsInt, IsNotEmpty, Min, Validate } from 'class-validator'
import { IsPrice } from 'src/helpers/is-price.helper'
import { ServiceTypeExists } from 'src/service-types/service-type-exists.helper'

export class CreateInterestDto {
  @ApiProperty()
  @Validate(ServiceTypeExists)
  @IsNotEmpty({ message: 'Escolha o tipo de serviço' })
  serviceType: number

  @ApiProperty()
  @Validate(IsPrice)
  @IsNotEmpty({ message: 'Digite o preço mínimo' })
  minPrice: number

  @ApiProperty()
  @Validate(IsPrice)
  @IsNotEmpty({ message: 'Digite o preço máximo' })
  maxPrice: number

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty({ message: 'Digite a primeira data e horário' })
  minDate: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty({ message: 'Digite a última data e horário' })
  maxDate: string

  @ApiProperty()
  @Min(1, { message: 'Quantidade de pessoas inválida' })
  @IsInt({ message: 'Quantidade de pessoas inválida' })
  @IsNotEmpty({ message: 'Digite a quantidade de pessoas' })
  people: number
}
