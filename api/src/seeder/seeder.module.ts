import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { CitiesModule } from 'src/cities/cities.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'
import { ServiceTypesModule } from 'src/service-types/service-types.module'

@Module({
  imports: [TypeOrmModule.forRoot(config), CitiesModule, ServiceTypesModule],
  providers: [SeederService],
})
export class SeederModule {}
