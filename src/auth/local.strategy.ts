import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'
import { User } from '@prisma/client'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { verify } from 'argon2'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      usernameField: 'login',
    })
  }

  async validate(
    login: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // Ищем пользователя по login
    const user = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }

    // Проверяем пароль с использованием argon2
    const isPasswordValid = await verify(user.password, password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль')
    }

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
