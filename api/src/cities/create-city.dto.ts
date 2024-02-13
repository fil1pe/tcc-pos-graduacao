import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateCityDto {
  @IsNotEmpty({ message: 'Digite o nome da cidade' })
  name: string

  @MaxLength(2, { message: 'UF inválida' })
  @MinLength(2, { message: 'UF inválida' })
  @IsNotEmpty({ message: 'Digite a UF da cidade' })
  uf: string
}
