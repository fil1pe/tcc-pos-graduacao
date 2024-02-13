import { Module } from '@nestjs/common'
import { CitiesModule } from './cities/cities.module'
import { ServiceTypesModule } from './service-types/service-types.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './ormconfig'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { EstablishmentsModule } from './establishments/establishments.module'
import { OffersModule } from './offers/offers.module'
import { InterestsModule } from './interests/interests.module'
import { MatchesModule } from './matches/matches.module'
import { SeederModule } from './seeder/seeder.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    CitiesModule,
    ServiceTypesModule,
    UsersModule,
    AuthModule,
    EstablishmentsModule,
    OffersModule,
    InterestsModule,
    MatchesModule,
    SeederModule,
  ],
})
export class AppModule {}
