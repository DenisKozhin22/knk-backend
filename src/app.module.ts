import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { RequestModule } from './request/request.module'
import { PaginationService } from './pagination/pagination.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, PaginationService],
})
export class AppModule {}
