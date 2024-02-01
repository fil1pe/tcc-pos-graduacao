import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { EstablishmentsService } from './establishments.service'
import { CreateEstablishmentDto } from './dto/create-establishment.dto'
import { UpdateEstablishmentDto } from './dto/update-establishment.dto'

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(createEstablishmentDto)
  }

  @Get(':cnpj')
  findOne(@Param('cnpj') cnpj: string) {
    return this.establishmentsService.findOne(cnpj)
  }

  @Patch(':cnpj')
  update(
    @Param('cnpj') cnpj: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(cnpj, updateEstablishmentDto)
  }

  @Delete(':cnpj')
  remove(@Param('cnpj') cnpj: string) {
    return this.establishmentsService.remove(cnpj)
  }
}
