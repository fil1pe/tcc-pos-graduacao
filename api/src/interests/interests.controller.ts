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
import { ApiTags } from '@nestjs/swagger'

@ApiTags('interests')
@Controller()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @UseGuards(AuthGuard)
  @Post('interests')
  // Cadastra interesse:
  create(@Request() req, @Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(req.user.sub, createInterestDto)
  }

  @UseGuards(AuthGuard)
  @Get('users/me/interests')
  // Busca todos os interesses do usuário:
  findAll(@Request() req) {
    return this.interestsService.findAll(req.user.sub)
  }

  @UseGuards(AuthGuard)
  @Get('interests/:id')
  // Busca interesse específico do usuário:
  findOne(@Request() req, @Param('id') id: string) {
    return this.interestsService.findOne(req.user.sub, +id)
  }

  @UseGuards(AuthGuard)
  @Delete('interests/:id')
  // Remove interesse do usuário:
  remove(@Request() req, @Param('id') id: string) {
    return this.interestsService.remove(req.user.sub, +id)
  }
}
