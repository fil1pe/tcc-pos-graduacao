import { ApiProperty } from '@nestjs/swagger'

export class CreateInterestDto {
  @ApiProperty()
  serviceType: number

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
