import { Module } from '@nestjs/common'
import { RequestController } from './request.controller'
import { RequestService } from './request.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [RequestController],
  providers: [RequestService, PaginationService],
})
export class RequestModule {}
