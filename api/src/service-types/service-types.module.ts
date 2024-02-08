import { Module } from '@nestjs/common'
import { ServiceTypesService } from './service-types.service'
import { ServiceTypesController } from './service-types.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServiceType } from './service-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypesController],
  providers: [ServiceTypesService],
})
export class ServiceTypesModule {}
