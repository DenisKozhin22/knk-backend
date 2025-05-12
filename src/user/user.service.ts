import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PaginationResultDto } from 'src/pagination/dto/pagination-result.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  removePassword(user: User) {
    const { password, ...safeUser } = user
    return safeUser
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    })
  }

  async getByLogin(login: string) {
    return this.prisma.user.findUnique({
      where: { login },
    })
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async getAll(dto: {
    page?: number
    limit?: number
    excludeUserId?: number
  }): Promise<PaginationResultDto<User>> {
    const { page = 1, limit = 10, excludeUserId } = dto
    const { skip, take } = this.paginationService.getPaginationParams(dto)

    const whereClause: Prisma.UserWhereInput = excludeUserId
      ? { NOT: { id: excludeUserId } }
      : {}

    const totalCount = await this.prisma.user.count({ where: whereClause })

    const data = await this.prisma.user.findMany({
      where: whereClause,
      skip,
      take,
    })

    return new PaginationResultDto(data, totalCount, { page, limit })
  }
}
