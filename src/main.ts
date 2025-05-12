import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const port = process.env.PORT || 4000

  const app = await NestFactory.create(AppModule)

  // Создание конфигурации Swagger
  const config = new DocumentBuilder()
    .setTitle('Название API')
    .setDescription('Описание вашего API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api', 'API префикс')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'https://knk-frontend.onrender.com'],
    credentials: true,
  })

  await app.listen(port)
}

bootstrap()
