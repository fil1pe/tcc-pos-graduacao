import { ApiProperty } from '@nestjs/swagger'

export class CreateOfferDto {
  @ApiProperty()
  minPeople: number

  @ApiProperty()
  maxPeople: number
}
