import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common'
import { MatchesService } from './matches.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('matches')
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(AuthGuard)
  @Post('interests/:id/reserve')
  // Faz reserva conforme match:
  create(@Request() req, @Param('id') id: string) {
    return this.matchesService.reserve(req.user.sub, +id)
  }
}
