import { Module } from '@nestjs/common'
import { CitiesModule } from './cities/cities.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './ormconfig'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { EstablishmentsModule } from './establishments/establishments.module'
import { OffersModule } from './offers/offers.module'
import { InterestsModule } from './interests/interests.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    CitiesModule,
    UsersModule,
    AuthModule,
    EstablishmentsModule,
    OffersModule,
    InterestsModule,
  ],
})
export class AppModule {}
