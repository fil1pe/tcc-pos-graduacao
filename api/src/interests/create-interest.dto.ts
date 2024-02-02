export class CreateInterestDto {
  serviceType: string

  minPrice?: number

  maxPrice?: number

  minDate: Date

  maxDate: Date

  people: number
}
