import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common'
import { EstablishmentsService } from './establishments.service'
import { CreateEstablishmentDto } from './dto/create-establishment.dto'
import { UpdateEstablishmentDto } from './dto/update-establishment.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('establishments')
@Controller()
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(AuthGuard)
  @Post('establishments')
  // Cadastra estabelecimento:
  create(
    @Request() req,
    @Body() createEstablishmentDto: CreateEstablishmentDto,
  ) {
    return this.establishmentsService.create(
      req.user.sub,
      createEstablishmentDto,
    )
  }

  @UseGuards(AuthGuard)
  @Get('users/me/establishments')
  // Busca estabelecimentos por admin:
  findAll(@Request() req) {
    return this.establishmentsService.findAll(req.user.sub)
  }

  @Get('establishments/:cnpj')
  // Busca estabelecimento específico:
  findOne(@Param('cnpj') cnpj: string) {
    return this.establishmentsService.findOne(cnpj)
  }

  @UseGuards(AuthGuard)
  @Patch('establishments/:cnpj')
  // Altera dados de estabelecimento:
  update(
    @Request() req,
    @Param('cnpj') cnpj: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(
      req.user.sub,
      cnpj,
      updateEstablishmentDto,
    )
  }

  @UseGuards(AuthGuard)
  @Delete('establishments/:cnpj')
  // Remove estabelecimento:
  remove(@Request() req, @Param('cnpj') cnpj: string) {
    return this.establishmentsService.remove(req.user.sub, cnpj)
  }
}
