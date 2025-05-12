import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
  Patch,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { RequestService } from './request.service'
import { GetAllRequestsDto } from './dto/get-all-requests.dto'
import { RequestStatus } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RolesGuard } from 'src/auth/roles.guard'
import { Roles } from 'src/auth/roles-auth.decorator'
import { UserJwtPayload } from 'src/types/user-jwt-payload.interface'
import { RequestCreateDto } from './dto/request-create.dto'
import { RequestEntity } from './entities/request.entity'
import { PaginationResultDto } from 'src/pagination/dto/pagination-result.dto'
import {
  ApiAssignRequest,
  ApiCompleteRequestByAdmin,
  ApiCreateRequest,
  ApiDeleteRequest,
  ApiGetAllRequestsForAdmin,
  ApiGetAllRequestsForUser,
  ApiGetAssignedRequests,
} from './request.swagger'
import { CompleteRequestDto } from './dto/complete-request.dto'

@ApiTags('Request')
@ApiBearerAuth()
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiCreateRequest()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post()
  async create(
    @Request() req,
    @Body() data: RequestCreateDto,
  ): Promise<RequestEntity> {
    const user = req.user as UserJwtPayload

    const request = await this.requestService.create({
      ...data,
      user: { connect: { id: user.id } },
      status: RequestStatus.PENDING,
    })

    return new RequestEntity(request)
  }

  @ApiGetAllRequestsForUser()
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getAllForUser(
    @Request() req,
    @Query() dto: GetAllRequestsDto,
  ): Promise<PaginationResultDto<RequestEntity>> {
    const user = req.user as UserJwtPayload

    const res = await this.requestService.getAllForUser(user.id, dto)

    return res
  }

  @ApiAssignRequest()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/:id/assign-an-admin')
  async assign(
    @Request() req,
    @Param('id', ParseIntPipe) requestId: number,
  ): Promise<RequestEntity> {
    const user = req.user as UserJwtPayload

    const request = await this.requestService.assignAnAdmin(user.id, requestId)

    return new RequestEntity(request)
  }

  @ApiGetAssignedRequests()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('assigned-to-admin')
  async getAssigned(@Request() req, @Query() dto: GetAllRequestsDto) {
    const user = req.user as UserJwtPayload

    const res = await this.requestService.getAllAssignedForAdmin(dto, user.id)

    return res
  }

  @ApiCompleteRequestByAdmin()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id/complete-by-admin')
  async completeByAdmin(
    @Request() req,
    @Param('id', ParseIntPipe) requestId: number,
    @Body() dto?: CompleteRequestDto,
  ): Promise<RequestEntity> {
    const user = req.user as UserJwtPayload

    await this.requestService.checkAssignedTo(user.id, requestId)

    const request = await this.requestService.completeByAdmin(
      user.id,
      requestId,
      dto.status,
      dto.assignedComment,
    )

    return new RequestEntity(request)
  }

  @ApiGetAllRequestsForAdmin()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  async getAllForAdmin(
    @Query() dto: GetAllRequestsDto,
  ): Promise<PaginationResultDto<RequestEntity>> {
    const res = await this.requestService.getAllForAdmin(dto)

    return res
  }

  @ApiDeleteRequest()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<null> {
    const user = req.user as UserJwtPayload

    await this.requestService.remove(user.id, id)

    return null
  }
}
