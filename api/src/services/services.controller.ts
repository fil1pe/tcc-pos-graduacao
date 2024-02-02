import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ServicesService } from './services.service'
import { CreateServiceDto } from './create-service.dto'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('establishments/:cnpj/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post()
  // Cadastra serviço:
  create(
    @Request() req,
    @Param('cnpj') cnpj: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(req.user.sub, cnpj, createServiceDto)
  }

  @Get()
  // Busca todos os serviços de um estabelecimento:
  findAll(@Param('cnpj') cnpj: string) {
    return this.servicesService.findAll(cnpj)
  }

  @Get(':id')
  // Busca serviço específico de um estabelecimento:
  findOne(@Param('cnpj') cnpj: string, @Param('id') id: string) {
    return this.servicesService.findOne(cnpj, +id)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  // Remove serviço:
  remove(@Request() req, @Param('cnpj') cnpj: string, @Param('id') id: string) {
    return this.servicesService.remove(req.user.sub, cnpj, +id)
  }
}
