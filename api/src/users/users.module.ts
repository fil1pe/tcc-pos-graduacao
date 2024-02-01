import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { EstablishmentsModule } from 'src/establishments/establishments.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), EstablishmentsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
