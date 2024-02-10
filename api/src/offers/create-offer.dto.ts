import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class CreateOfferDto {
  @ApiProperty()
  @Min(1, { message: 'Quantidade de pessoas inválida' })
  @IsInt({ message: 'Quantidade de pessoas inválida' })
  @IsNotEmpty({ message: 'Digite a quantidade mínima de pessoas' })
  minPeople: number

  @ApiProperty()
  @Min(1, { message: 'Quantidade de pessoas inválida' })
  @IsInt({ message: 'Quantidade de pessoas inválida' })
  @IsNotEmpty({ message: 'Digite a quantidade máxima de pessoas' })
  maxPeople: number
}
