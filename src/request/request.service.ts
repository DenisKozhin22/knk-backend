import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, Request, RequestStatus } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetAllRequestsDto } from './dto/get-all-requests.dto'
import { RequestEntity } from './entities/request.entity'
import { plainToInstance } from 'class-transformer'
import { PaginationService } from 'src/pagination/pagination.service'
import { PaginationResultDto } from 'src/pagination/dto/pagination-result.dto'

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(data: Prisma.RequestCreateInput): Promise<Request> {
    const request = await this.prisma.request.create({
      data,
      include: {
        assignedTo: true,
        user: true,
      },
    })

    return request
  }

  async getById(id: number): Promise<Request> {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        user: true,
      },
    })

    if (!request) {
      throw new NotFoundException(`Заявка с id ${id} не найдена`)
    }

    return request
  }

  async checkRequestOwnership(
    userId: number,
    requestId: number,
  ): Promise<Request> {
    const request = await this.getById(requestId)

    if (request.userId !== userId) {
      throw new ForbiddenException('У вас нет доступа к этому запросу')
    }

    return request
  }

  async checkAssignedTo(assignedId: number, requestId: number): Promise<void> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      throw new NotFoundException(`Запрос с id ${requestId} не найден`)
    }

    if (request.assignedToId !== assignedId) {
      throw new ForbiddenException('Вы не можете работать с этим запросом')
    }
  }

  async assignAnAdmin(userId: number, requestId: number): Promise<Request> {
    return this.prisma.request.update({
      where: { id: requestId },
      data: { assignedToId: userId, status: RequestStatus.IN_PROGRESS },
      include: {
        assignedTo: true,
        user: true,
      },
    })
  }

  private async getPaginatedRequests(
    whereClause: Prisma.RequestWhereInput,
    dto: GetAllRequestsDto,
  ): Promise<PaginationResultDto<RequestEntity>> {
    const { page = 1, limit = 10 } = dto
    const { skip, take } = this.paginationService.getPaginationParams(dto)

    const totalCount = await this.prisma.request.count({ where: whereClause })

    if (!totalCount) {
      return new PaginationResultDto([], totalCount, { page, limit })
    }

    const data = await this.prisma.request.findMany({
      where: whereClause,
      skip,
      take,
      include: { assignedTo: true, user: true },
      orderBy: { createdAt: 'desc' },
    })

    const serializedData = plainToInstance(RequestEntity, data, {
      excludeExtraneousValues: true,
    })

    return new PaginationResultDto(serializedData, totalCount, { page, limit })
  }

  async getAllForAdmin(dto: GetAllRequestsDto) {
    return this.getPaginatedRequests({}, dto)
  }

  async getAllAssignedForAdmin(dto: GetAllRequestsDto, assignedToId: number) {
    return this.getPaginatedRequests({ assignedToId }, dto)
  }

  async getAllForUser(userId: number, dto: GetAllRequestsDto) {
    return this.getPaginatedRequests({ userId }, dto)
  }

  async completeByAdmin(
    assignedId: number,
    requestId: number,
    status: Exclude<RequestStatus, 'IN_PROGRESS' | 'PENDING'>,
    assignedComment?: string,
  ): Promise<Request> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      throw new NotFoundException(`Запрос с id ${assignedId} не найден`)
    }

    if (request.assignedToId !== assignedId) {
      throw new ForbiddenException('Вы не можете завершить этот запрос')
    }

    return this.prisma.request.update({
      where: { id: requestId },
      data: { status, assignedComment },
      include: {
        assignedTo: true,
        user: true,
      },
    })
  }

  async canceled(userId: number, requestId: number): Promise<Request> {
    await this.checkRequestOwnership(userId, requestId)

    return this.prisma.request.update({
      where: { id: requestId },
      data: { status: RequestStatus.REJECTED },
      include: {
        assignedTo: true,
        user: true,
      },
    })
  }

  async remove(userId: number, requestId: number): Promise<Request> {
    await this.checkRequestOwnership(userId, requestId)

    return this.prisma.request.delete({
      where: { id: requestId },
      include: {
        assignedTo: true,
        user: true,
      },
    })
  }
}
