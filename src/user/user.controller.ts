import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/auth/roles-auth.decorator'
import { RolesGuard } from 'src/auth/roles.guard'
import { UserJwtPayload } from 'src/types/user-jwt-payload.interface'
import { UserEntity } from './entities/user.entity'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiOkResponse({ description: 'Профиль пользователя', type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserEntity> {
    const userReq = req.user as UserJwtPayload

    const user = await this.userService.getById(userReq.id)

    if (!user) {
      throw new NotFoundException(`User not found`)
    }
    return new UserEntity(user)
  }

  @ApiOperation({
    summary: 'Получить пользователя по ID (только для администраторов)',
  })
  @ApiOkResponse({ description: 'Данные пользователя', type: UserEntity })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const user = await this.userService.getById(id)

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return new UserEntity(user)
  }
}
