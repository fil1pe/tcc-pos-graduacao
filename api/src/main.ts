import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000)
}
bootstrap()
