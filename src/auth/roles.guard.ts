import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Roles, ROLES_KEY } from './roles-auth.decorator'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ERROR_MESSAGES } from 'src/constants/errors'
import { Role } from '@prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: Role[] | null = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest() as Request

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ForbiddenException(ERROR_MESSAGES.tokenMissing)
    }

    try {
      const user = this.jwtService.verify(token)

      return roles.includes(user.role)
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidToken)
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
