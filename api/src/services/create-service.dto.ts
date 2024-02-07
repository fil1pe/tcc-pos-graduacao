import { ApiProperty } from '@nestjs/swagger'

export class CreateServiceDto {
  @ApiProperty()
  type: string

  @ApiProperty()
  price: number
}
