import { Controller, Get, Param } from '@nestjs/common'
import { ServiceTypesService } from './service-types.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('service types')
@Controller('services/types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Get()
  // Busca todos os tipos de serviço:
  findAll() {
    return this.serviceTypesService.findAll()
  }

  @Get(':id')
  // Busca tipo específico de serviço:
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(+id)
  }
}
