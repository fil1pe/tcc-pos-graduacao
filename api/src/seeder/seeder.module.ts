import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { CitiesModule } from 'src/cities/cities.module'
import { ServiceTypesModule } from 'src/service-types/service-types.module'

@Module({
  imports: [CitiesModule, ServiceTypesModule],
  providers: [SeederService],
})
export class SeederModule {}
