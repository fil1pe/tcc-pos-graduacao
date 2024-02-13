import { IsNotEmpty } from 'class-validator'

export class CreateServiceTypeDto {
  @IsNotEmpty({ message: 'Digite o nome do tipo de serviço' })
  name: string
}
