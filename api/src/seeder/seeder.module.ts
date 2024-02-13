import { Module } from '@nestjs/common'
import { SeederService } from './seeder.service'
import { CitiesModule } from 'src/cities/cities.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'src/ormconfig'

@Module({
  imports: [TypeOrmModule.forRoot(config), CitiesModule],
  providers: [SeederService],
})
export class SeederModule {}
