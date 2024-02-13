import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CitiesController } from './cities.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { City } from './city.entity'
import { CityExists } from './city-exists.helper'

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  controllers: [CitiesController],
  providers: [CitiesService, CityExists],
  exports: [CitiesService],
})
export class CitiesModule {}
