import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { exceptionFactory } from './helpers/exception-factory.helper'
import { useContainer } from 'class-validator'
import { SeederModule } from './seeder/seeder.module'
import { SeederService } from './seeder/seeder.service'

async function bootstrap() {
  // Seeds p/ banco de dados:
  NestFactory.createApplicationContext(SeederModule).then((appContext) =>
    appContext.get(SeederService).seed(),
  )

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // OpenAPI:
  const config = new DocumentBuilder().setTitle('API').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}
bootstrap()
