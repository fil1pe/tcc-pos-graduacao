import { Module, forwardRef } from '@nestjs/common'
import { EstablishmentsService } from './establishments.service'
import { EstablishmentsController } from './establishments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Establishment } from './establishment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Establishment])],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
