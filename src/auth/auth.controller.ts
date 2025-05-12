import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthResponseDto } from './dto/auth-response.dto'
import { ApiTags } from '@nestjs/swagger'
import { ApiLogin, ApiRefresh, ApiRegister } from './auth.swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiRegister()
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto)
  }

  @ApiLogin()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto)
  }

  @ApiRefresh()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization: string,
  ): Promise<AuthResponseDto> {
    const refreshToken = authorization.replace('Bearer ', '')
    return this.authService.refreshTokens(refreshToken)
  }
}
