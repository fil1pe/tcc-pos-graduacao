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

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createEstablishmentDto: CreateEstablishmentDto,
  ) {
    return this.establishmentsService.create(
      req.user.sub,
      createEstablishmentDto,
    )
  }

  @Get(':cnpj')
  findOne(@Param('cnpj') cnpj: string) {
    return this.establishmentsService.findOne(cnpj)
  }

  @UseGuards(AuthGuard)
  @Patch(':cnpj')
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
  @Delete(':cnpj')
  remove(@Request() req, @Param('cnpj') cnpj: string) {
    return this.establishmentsService.remove(req.user.sub, cnpj)
  }
}
