import { Injectable } from '@nestjs/common'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_NUMBER = 1

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    totalPerPage: number
    prevPage: number | null
    nextPage: number | null
  }
}

@Injectable()
export class PaginationService {
  getPaginationParams(query: { page?: number; limit?: number }): {
    skip: number
    take: number
  } {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_SIZE
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
    return {
      skip: limit * (page - 1),
      take: limit,
    }
  }

  async paginate<T>(
    data: T[],
    total: number,
    query: { page?: number; limit?: number },
  ): Promise<PaginatedResult<T>> {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_SIZE
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER
    const lastPage = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        totalPerPage: limit,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < lastPage ? page + 1 : null,
      },
    }
  }
}
