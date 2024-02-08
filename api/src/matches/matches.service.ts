import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Match } from './match.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  // Faz reserva conforme match:
  async reserve(cpf: string, iid: number) {
    const { affected } = await this.matchesRepository.update(
      {
        interest: {
          id: iid,
          user: {
            cpf,
          },
        },
      },
      {
        reserved: true,
      },
    )
    if (!affected) throw new UnauthorizedException()
  }
}
