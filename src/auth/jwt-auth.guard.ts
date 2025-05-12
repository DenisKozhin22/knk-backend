import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const user = this.jwtService.verify(token)

      request['user'] = user
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Срок действия токена истёк')
        }

        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Токен недействителен')
        }

        if (error.name === 'NotBeforeError') {
          throw new UnauthorizedException('Токен ещё не активен')
        }
      }

      throw new UnauthorizedException('Ошибка авторизации')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
