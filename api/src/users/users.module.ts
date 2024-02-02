import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { EstablishmentsModule } from 'src/establishments/establishments.module'
import { InterestsModule } from 'src/interests/interests.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EstablishmentsModule,
    InterestsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
