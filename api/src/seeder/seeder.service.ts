import { Injectable } from '@nestjs/common'
import { CitiesService } from 'src/cities/cities.service'
import { ServiceTypesService } from 'src/service-types/service-types.service'

@Injectable()
export class SeederService {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly serviceTypesService: ServiceTypesService,
  ) {}

  seed() {
    return Promise.all([
      this.citiesService.seed([
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
      ]),
      this.serviceTypesService.seed([
        {
          name: 'Refeição',
        },
        {
          name: 'Ingresso de museu',
        },
      ]),
    ])
  }
}
