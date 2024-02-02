import { Module } from '@nestjs/common'
import { OffersService } from './offers.service'
import { OffersController } from './offers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Offer } from './offer.entity'
import { ServicesModule } from 'src/services/services.module'

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), ServicesModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
