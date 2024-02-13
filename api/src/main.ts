import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { exceptionFactory } from './helpers/exception-factory.helper'
import { useContainer } from 'class-validator'
import { SeederService } from './seeder/seeder.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // Seeds p/ banco de dados:
  app.get(SeederService).seed()

  // OpenAPI:
  const config = new DocumentBuilder().setTitle('API').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
