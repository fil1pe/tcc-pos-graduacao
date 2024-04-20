import { Module } from '@nestjs/common'
import { InterestsService } from './interests.service'
import { InterestsController } from './interests.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Interest } from './interest.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    TypeOrmModule.forFeature([Interest]),
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.RMQ_QUEUE,
        },
      },
    ]),
  ],
  controllers: [InterestsController],
  providers: [InterestsService],
  exports: [InterestsService],
})
export class InterestsModule {}
