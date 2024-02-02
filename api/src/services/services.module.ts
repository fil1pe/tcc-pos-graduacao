import { Module, forwardRef } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Service } from './service.entity'
import { EstablishmentsModule } from '../establishments/establishments.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    forwardRef(() => EstablishmentsModule),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
