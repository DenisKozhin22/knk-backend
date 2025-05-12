import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from 'src/config/jwt.config'
import { JwtStrategy } from './jwt.strategy'
import { UserService } from 'src/user/user.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { PaginationService } from 'src/pagination/pagination.service'

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    JwtStrategy,
    LocalStrategy,
    PaginationService,
  ],
})
export class AuthModule {}
