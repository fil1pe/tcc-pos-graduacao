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
import { ApiTags } from '@nestjs/swagger'

@ApiTags('services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post('establishments/:cnpj/services')
  // Cadastra serviço:
  create(
    @Request() req,
    @Param('cnpj') cnpj: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(req.user.sub, cnpj, createServiceDto)
  }

  @Get('establishments/:cnpj/services')
  // Busca todos os serviços de um estabelecimento:
  findAll(@Param('cnpj') cnpj: string) {
    return this.servicesService.findAll(cnpj)
  }

  @Get('services/:id')
  // Busca serviço específico:
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id)
  }

  @UseGuards(AuthGuard)
  @Delete('services/:id')
  // Remove serviço:
  remove(@Request() req, @Param('id') id: string) {
    return this.servicesService.remove(req.user.sub, +id)
  }
}
