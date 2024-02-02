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
import { OffersService } from './offers.service'
import { CreateOfferDto } from './create-offer.dto'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(AuthGuard)
  @Post('services/:id/offers')
  // Cadastra oferta:
  create(
    @Request() req,
    @Param('id') id: string,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offersService.create(req.user.sub, +id, createOfferDto)
  }

  @Get('services/:id/offers')
  // Busca todas as ofertas de um serviço:
  findAll(@Param('id') id: string) {
    return this.offersService.findAll(+id)
  }

  @Get('offers/:oid')
  // Busca oferta específica:
  findOne(@Param('oid') oid: string) {
    return this.offersService.findOne(+oid)
  }

  @UseGuards(AuthGuard)
  @Delete('offers/:oid')
  // Remove oferta:
  remove(@Request() req, @Param('oid') oid: string) {
    return this.offersService.remove(req.user.sub, +oid)
  }
}
