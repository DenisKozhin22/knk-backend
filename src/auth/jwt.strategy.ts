import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { GenerateTokensDto } from './dto/generate-tokens.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate({ login, id, role }: GenerateTokensDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    })

    if (!user) throw new UnauthorizedException('Пользовватель не авторизован')

    return user
  }
}
