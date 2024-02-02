import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common'
import { InterestsService } from './interests.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { CreateInterestDto } from './create-interest.dto'

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @UseGuards(AuthGuard)
  @Post()
  // Cadastra interesse:
  create(@Request() req, @Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(req.user.sub, createInterestDto)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  // Busca interesse específico do usuário:
  findOne(@Request() req, @Param('id') id: string) {
    return this.interestsService.findOne(req.user.sub, +id)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  // Remove interesse do usuário:
  remove(@Request() req, @Param('id') id: string) {
    return this.interestsService.remove(req.user.sub, +id)
  }
}
