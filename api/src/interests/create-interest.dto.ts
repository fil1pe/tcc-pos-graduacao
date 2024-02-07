import { ApiProperty } from '@nestjs/swagger'

export class CreateInterestDto {
  @ApiProperty()
  serviceType: string

  @ApiProperty()
  minPrice?: number

  @ApiProperty()
  maxPrice?: number

  @ApiProperty()
  minDate: Date

  @ApiProperty()
  maxDate: Date

  @ApiProperty()
  people: number
}
