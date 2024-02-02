import { Module, forwardRef } from '@nestjs/common'
import { EstablishmentsService } from './establishments.service'
import { EstablishmentsController } from './establishments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Establishment } from './entities/establishment.entity'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Establishment]),
    forwardRef(() => ServicesModule),
  ],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
