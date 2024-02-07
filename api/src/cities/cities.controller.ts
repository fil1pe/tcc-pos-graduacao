import { Controller, Get, Param } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  // Busca todas as cidades:
  findAll() {
    return this.citiesService.findAll()
  }

  @Get(':id')
  // Busca cidade específica:
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id)
  }
}
