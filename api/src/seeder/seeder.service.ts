import { Injectable } from '@nestjs/common'
import { CitiesService } from 'src/cities/cities.service'

@Injectable()
export class SeederService {
  constructor(private readonly citiesService: CitiesService) {}

  seed() {
    return this.citiesService.create([
      {
        name: 'Porto Alegre',
        uf: 'RS',
      },
      {
        name: 'Joinville',
        uf: 'SC',
      },
      {
        name: 'São Paulo',
        uf: 'SP',
      },
    ])
  }
}
