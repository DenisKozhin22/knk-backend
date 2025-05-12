import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role, User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { GenerateTokensDto } from './dto/generate-tokens.dto'
import { UserJwtPayload } from 'src/types/user-jwt-payload.interface'
import { AuthResponseDto } from './dto/auth-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateTokens(payload: GenerateTokensDto) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    })

    return { accessToken, refreshToken }
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const candidate = await this.userService.getByLogin(data.login)

    if (candidate) {
      throw new ConflictException('Пользователь с таким логином уже существует')
    }

    const hashedPassword = await hash(data.password)

    const user = await this.userService.create({
      ...data,
      role: Role.USER,
      password: hashedPassword,
    })

    const tokens = this.generateTokens({
      id: user.id,
      role: Role.USER,
      login: user.login,
    })

    return new AuthResponseDto({
      ...tokens,
      user,
    })
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(data)

    const tokens = this.generateTokens({
      id: user.id,
      role: user.role,
      login: user.login,
    })

    return new AuthResponseDto({
      ...tokens,
      user,
    })
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    const payload = this.jwtService.verify(refreshToken) as UserJwtPayload

    const user = await this.userService.getById(payload.id)

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    const tokens = this.generateTokens({
      id: user.id,
      role: user.role,
      login: user.login,
    })

    return new AuthResponseDto({
      ...tokens,
      user,
    })
  }

  async validateUser(data: LoginDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { login: data.login },
    })

    if (user) {
      const isPasswordValid = await verify(user.password, data.password)

      if (isPasswordValid) return user
    }

    throw new UnauthorizedException('Неверный логин или пароль')
  }
}
