import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthResponseDto } from './dto/auth-response.dto'

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Регистрация нового пользователя' }),
    ApiResponse({
      status: 201,
      description: 'Пользователь успешно зарегистрирован.',
      type: AuthResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Некорректные данные.' }),
    ApiBody({
      type: RegisterDto,
    }),
  )

export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Авторизация пользователя' }),
    ApiResponse({
      status: 200,
      description: 'Успешная авторизация.',
      type: AuthResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Неверные учетные данные.' }),
    ApiBody({
      type: LoginDto,
    }),
  )

export const ApiRefresh = () =>
  applyDecorators(
    ApiOperation({ summary: 'Обновление токенов' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Токены успешно обновлены.',
      type: AuthResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Невалидный токен.' }),
  )
